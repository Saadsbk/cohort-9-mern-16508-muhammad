import supertest from "supertest";
import { assert } from "chai";
import app from "../src/app.ts";
import { db } from "../src/index.ts";
import { users } from "../src/db/schema/schema.ts";
import { eq } from "drizzle-orm";

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
		// Clean up created user after tests complete
		await db.delete(users).where(eq(users.id, createdUserId));
	});
	
	describe("POST /api/auth/sign-up", () => {
		
		it("[BASE CASE] Should successfully sign up a new user", async () => {
			const res = await supertest(app)
				.post("/api/auth/sign-up")
				.send(testUser);
	
			assert.strictEqual(res.status, 201);
			assert.strictEqual(res.body.success, true);
			assert.isString(res.body.data.userId);
			createdUserId = res.body.data.userId;
		});

		it("[EDGE CASE] Should reject sign up when confirmPassword does not match", async () => {
			const res = await supertest(app)
				.post("/api/auth/sign-up")
				.send({
					...testUser,
					confirmPassword: "TestPassword",
				});

			assert.strictEqual(res.status, 400);
			assert.strictEqual(res.body.success, false);
			assert.isOk(res.body.message);
		});


		it("[EDGE CASE] Should reject duplicate sign up with same username or email", async () => {
			const res = await supertest(app)
				.post("/api/auth/sign-up")
				.send(testUser);

			assert.strictEqual(res.status, 400);
			assert.strictEqual(res.body.success, false);
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

			assert.strictEqual(res.status, 200);
			assert.strictEqual(res.body.success, true);
			assert.isString(res.body.data.accessToken);

			const cookies = res.get("Set-Cookie") as string[];
			assert.isTrue(cookies.some((c: string) => c.startsWith("refreshToken=")));

			refreshTokenCookie = cookies.find((c: string) => c.startsWith("refreshToken=")) || "";
		});


		it("[EDGE CASE] Should reject HTTP request when username is below minimum length (< 2 chars)", async () => {
			const res = await supertest(app)
				.post("/api/auth/sign-in")
				.send({
					username: "t",
					password: "TestPassword123",
				});

			assert.strictEqual(res.status, 400);
			assert.strictEqual(res.body.success, false);
		});

		it("[EDGE CASE] Should reject HTTP request when username exceeds maximum length (> 30 chars)", async () => {
			const res = await supertest(app)
				.post("/api/auth/sign-in")
				.send({
					username: "testvgrv3frvtt4bvt4bgvr3fcwy5hbvtg43cy5hbt4njncejdwxkshbhbecxw4gvrfc3y5hbt4vg",
					password: "TestPassword123",
				});

			assert.strictEqual(res.status, 400);
			assert.strictEqual(res.body.success, false);
		});

		it("[EDGE CASE] Should reject HTTP request when password is below minimum length (< 8 chars)", async () => {
			const res = await supertest(app)
				.post("/api/auth/sign-in")
				.send({
					username: "test",
					password: "small",
				});

			assert.strictEqual(res.status, 400);
			assert.strictEqual(res.body.success, false);
		});

		it("[EDGE CASE] Should reject sign in with incorrect password", async () => {
			const res = await supertest(app)
				.post("/api/auth/sign-in")
				.send({
					username: testUser.username,
					password: "TestPassword",
				});

			assert.strictEqual(res.status, 401);
			assert.strictEqual(res.body.success, false);
		});

	});

	describe("POST /api/auth/refresh-token", () => {
		
		it("[BASE CASE] Should successfully refresh access token using valid refresh cookie", async () => {
			const res = await supertest(app)
				.post("/api/auth/refresh-token")
				.set("Cookie", [refreshTokenCookie]);

			assert.strictEqual(res.status, 200);
			assert.strictEqual(res.body.success, true);
			assert.isString(res.body.data.accessToken);

			const cookies = res.get("Set-Cookie");
			if (cookies && cookies.length > 0) {
				const newCookie = cookies.find((c: string) => c.startsWith("refreshToken="));
				if (newCookie) {
					refreshTokenCookie = newCookie;
				}
			}
		});

		it("[EDGE CASE] Should reject token refresh when refresh cookie is missing", async () => {
			const res = await supertest(app).post("/api/auth/refresh-token");
			assert.strictEqual(res.status, 401);
			assert.strictEqual(res.body.success, false);
		});

	});

	describe("POST /api/auth/logout", () => {

		it("[BASE CASE] Should successfully log out user and clear refresh token cookie", async () => {
			const res = await supertest(app)
				.post("/api/auth/logout")
				.set("Cookie", [refreshTokenCookie]);

			assert.strictEqual(res.status, 200);
			assert.strictEqual(res.body.success, true);
		});
	});
});
