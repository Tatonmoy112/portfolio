export async function uploadToImgBB(file: File): Promise<string | null> {
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    if (!apiKey) {
        alert("Missing ImageBB API Key. Please set NEXT_PUBLIC_IMGBB_API_KEY in your .env file.");
        return null;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
            method: "POST",
            body: formData,
        });

        const data = await response.json();
        if (data.success) {
            return data.data.url;
        } else {
            console.error("ImgBB Upload Error:", data);
            alert("Upload failed: " + (data.error?.message || "Unknown error"));
            return null;
        }
    } catch (error) {
        console.error("ImgBB Network Error:", error);
        alert("Network error during upload.");
        return null;
    }
}
