import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ locals }) => {
  const user = locals.user || { hasToken: false, note: "No user in locals" };

  return new Response(
    JSON.stringify(user, null, 2),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};
