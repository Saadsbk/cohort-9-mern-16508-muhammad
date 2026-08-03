import supertest from "supertest";
import { assert } from "chai";
import app from "../src/app.ts";
import { db, closeDb } from "../src/index.ts";
import { users } from "../src/db/schema/schema.ts";
import { eq } from "drizzle-orm";
import type { ApiResponse } from "../src/utils/apiResponse.ts";
import type { SignInResult, SignUpResult } from "../src/services/auth.service.ts";

describe("Authentication API Integration Test Suite", () => {

	const testUser = {
		username: "test",
		email: "test@gamil.com",
		password: "TestPassword123",
		confirmPassword: "TestPassword123",
	};

	let refreshTokenCookie = "";
	let createdUserId = "";

	after(async () => {
		try {
			// Clean up created user after tests complete only when createdUserId is populated
			if (createdUserId) {
				await db.delete(users).where(eq(users.id, createdUserId));
			}
		} catch (error) {
			throw error;
		} finally {
			try {
				await closeDb();
			} catch (error) {
				console.error("Database close failed during test teardown:", error);
			}
		}
	});
	
	describe("POST /api/auth/sign-up", () => {
		
		it("[BASE CASE] Should successfully sign up a new user", async () => {
			const res = await supertest(app)
				.post("/api/auth/sign-up")
				.send(testUser);
	
			const body = res.body as ApiResponse<SignUpResult>;
			assert.strictEqual(res.status, 201);
			assert.strictEqual(body.success, true);
			if (body.success) {
				assert.isString(body.data.userId);
				createdUserId = body.data.userId;
			}
		});

		it("[EDGE CASE] Should reject sign up when confirmPassword does not match", async () => {
			const res = await supertest(app)
				.post("/api/auth/sign-up")
				.send({
					...testUser,
					confirmPassword: "TestPassword",
				});

			const body = res.body as ApiResponse<null>;
			assert.strictEqual(res.status, 400);
			assert.strictEqual(body.success, false);
			assert.isOk(body.message);
		});


		it("[EDGE CASE] Should reject duplicate sign up with same username or email", async () => {
			const res = await supertest(app)
				.post("/api/auth/sign-up")
				.send(testUser);

			const body = res.body as ApiResponse<null>;
			assert.strictEqual(res.status, 400);
			assert.strictEqual(body.success, false);
		});
	});

	describe("POST /api/auth/sign-in", () => {

		it("[BASE CASE] Should successfully sign in user and return access token & set-cookie", async () => {
			const res = await supertest(app)
				.post("/api/auth/sign-in")
				.send({
					username: testUser.username,
					password: testUser.password,
				});

			const body = res.body as ApiResponse<Omit<SignInResult, "refreshToken">>;
			assert.strictEqual(res.status, 200);
			assert.strictEqual(body.success, true);
			if (body.success) {
				assert.isString(body.data.accessToken);
			}

			const cookies = res.get("Set-Cookie");
			assert.isArray(cookies, "sign-in must set a refresh token cookie");
			assert.isTrue((cookies ?? []).some((c: string) => c.startsWith("refreshToken=")));

			const rawCookie = (cookies ?? []).find((c: string) => c.startsWith("refreshToken=")) ?? "";
			refreshTokenCookie = rawCookie.split(";")[0] ?? "";
		});


		it("[EDGE CASE] Should reject HTTP request when username is below minimum length (< 2 chars)", async () => {
			const res = await supertest(app)
				.post("/api/auth/sign-in")
				.send({
					username: "t",
					password: "TestPassword123",
				});

			const body = res.body as ApiResponse<null>;
			assert.strictEqual(res.status, 400);
			assert.strictEqual(body.success, false);
		});

		it("[EDGE CASE] Should reject HTTP request when username exceeds maximum length (> 30 chars)", async () => {
			const res = await supertest(app)
				.post("/api/auth/sign-in")
				.send({
					username: "testvgrv3frvtt4bvt4bgvr3fcwy5hbvtg43cy5hbt4njncejdwxkshbhbecxw4gvrfc3y5hbt4vg",
					password: "TestPassword123",
				});

			const body = res.body as ApiResponse<null>;
			assert.strictEqual(res.status, 400);
			assert.strictEqual(body.success, false);
		});

		it("[EDGE CASE] Should reject HTTP request when password is below minimum length (< 8 chars)", async () => {
			const res = await supertest(app)
				.post("/api/auth/sign-in")
				.send({
					username: "test",
					password: "small",
				});

			const body = res.body as ApiResponse<null>;
			assert.strictEqual(res.status, 400);
			assert.strictEqual(body.success, false);
		});

		it("[EDGE CASE] Should reject sign in with incorrect password", async () => {
			const res = await supertest(app)
				.post("/api/auth/sign-in")
				.send({
					username: testUser.username,
					password: "TestPassword",
				});

			const body = res.body as ApiResponse<null>;
			assert.strictEqual(res.status, 401);
			assert.strictEqual(body.success, false);
		});

	});

	describe("POST /api/auth/refresh-token", () => {
		
		it("[BASE CASE] Should successfully refresh access token using valid refresh cookie and reject pre-rotation token reuse", async () => {
			const preRotationCookie = refreshTokenCookie;

			const res = await supertest(app)
				.post("/api/auth/refresh-token")
				.set("Cookie", [refreshTokenCookie]);

			const body = res.body as ApiResponse<{ accessToken: string }>;
			assert.strictEqual(res.status, 200);
			assert.strictEqual(body.success, true);
			if (body.success) {
				assert.isString(body.data.accessToken);
			}

			const cookies = res.get("Set-Cookie");
			if (cookies && cookies.length > 0) {
				const newCookie = cookies.find((c: string) => c.startsWith("refreshToken="));
				if (newCookie) {
					refreshTokenCookie = newCookie.split(";")[0] ?? "";
				}
			}

			// Assert that reusing the pre-rotation cookie returns 403
			const oldCookieRes = await supertest(app)
				.post("/api/auth/refresh-token")
				.set("Cookie", [preRotationCookie]);

			assert.strictEqual(oldCookieRes.status, 403);
			assert.strictEqual((oldCookieRes.body as ApiResponse<null>).success, false);
		});

		it("[EDGE CASE] Should reject token refresh when refresh cookie is missing", async () => {
			const res = await supertest(app).post("/api/auth/refresh-token");
			const body = res.body as ApiResponse<null>;
			assert.strictEqual(res.status, 401);
			assert.strictEqual(body.success, false);
		});

	});

	describe("POST /api/auth/logout", () => {

		it("[BASE CASE] Should successfully log out user and clear refresh token cookie, revoking subsequent refresh requests", async () => {
			const res = await supertest(app)
				.post("/api/auth/logout")
				.set("Cookie", [refreshTokenCookie]);

			const body = res.body as ApiResponse<null>;
			assert.strictEqual(res.status, 200);
			assert.strictEqual(body.success, true);

			// Assert that using the logged-out refreshTokenCookie returns 403
			const loggedOutRes = await supertest(app)
				.post("/api/auth/refresh-token")
				.set("Cookie", [refreshTokenCookie]);

			assert.strictEqual(loggedOutRes.status, 403);
			assert.strictEqual((loggedOutRes.body as ApiResponse<null>).success, false);
		});
	});
});
