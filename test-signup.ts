import { authClient } from "./src/lib/auth-client"; // adjust path as needed

(async () => {
  const { error } = await authClient.signUp.email({
    email: "testuser@example.com", // change email for each run
    password: "testpassword123",
    name: "Test User",
  });

  if (error) {
    console.error("Sign-up error:", error);
  } else {
    console.log("Sign-up successful!");
  }
})();
