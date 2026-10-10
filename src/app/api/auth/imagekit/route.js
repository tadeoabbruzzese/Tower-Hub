import ImageKit from "imagekit";
import { handleImageKitAuth } from "@/lib/imagekit-auth.mjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request) {
  return handleImageKitAuth(request, {
    env: process.env,
    sign: () => {
      const imagekit = new ImageKit({
        publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
        privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
        urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
      });
      return imagekit.getAuthenticationParameters();
    },
  });
}
