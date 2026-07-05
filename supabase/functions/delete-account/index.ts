import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const authHeader = req.headers.get("Authorization");

    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
    });

    const {
      data: { user },
      error: userError,
    } = await userClient.auth.getUser();

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "User not authenticated" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const adminClient = createClient(
      supabaseUrl,
      supabaseServiceRoleKey
    );

    const userId = user.id;

    const { data: plants } = await adminClient
      .from("plants")
      .select("id")
      .eq("user_id", userId);

    const plantIds = (plants ?? []).map((plant) => plant.id);

    const { data: sensors } = await adminClient
      .from("sensors")
      .select("id")
      .eq("user_id", userId);

    const sensorIds = (sensors ?? []).map((sensor) => sensor.id);

    if (plantIds.length > 0) {
      await adminClient
        .from("plant_logs")
        .delete()
        .in("plant_id", plantIds);
    }

    if (sensorIds.length > 0) {
      await adminClient
        .from("sensor_readings")
        .delete()
        .in("sensor_id", sensorIds);
    }

    await adminClient
      .from("notifications")
      .delete()
      .eq("user_id", userId);

    await adminClient
      .from("plants")
      .delete()
      .eq("user_id", userId);

    await adminClient
      .from("sensors")
      .delete()
      .eq("user_id", userId);

    await adminClient
      .from("profiles")
      .delete()
      .eq("id", userId);

    await deleteUserStorageFiles(adminClient, "avatars", userId);
    await deleteUserStorageFiles(adminClient, "plant-images", userId);
    await deleteUserStorageFiles(adminClient, "plant-log-images", userId);

    const { error: deleteUserError } =
      await adminClient.auth.admin.deleteUser(userId);

    if (deleteUserError) {
      throw deleteUserError;
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.log("Delete account error:", error);

    return new Response(
      JSON.stringify({
        error:
          error instanceof Error
            ? error.message
            : "Account was not deleted",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

async function deleteUserStorageFiles(
  adminClient: any,
  bucketName: string,
  userId: string
) {
  const { data: files, error } = await adminClient.storage
    .from(bucketName)
    .list(userId);

  if (error || !files || files.length === 0) {
    return;
  }

  const filePaths = files.map((file: any) => `${userId}/${file.name}`);

  await adminClient.storage
    .from(bucketName)
    .remove(filePaths);
}