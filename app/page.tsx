"use client";
import { useState } from "react";

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>("image/jpeg");
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setMimeType(file.type);
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(",")[1];
      setImage(base64);
    };
    reader.readAsDataURL(file);
  }

  async function analyzeImage() {
    if (!image) return;
    setLoading(true);
    setResult("");
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageBase64: image, mimeType }),
    });
    const data = await response.json();
    setResult(data.result);
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-stone-50 flex flex-col items-center px-4 py-10">
      <div className="w-full max-w-md mb-8 text-center">
        <h1 className="text-3xl font-bold text-stone-800">Westkustauktioner</h1>
        <p className="text-stone-500 mt-1">Värdera ditt föremål gratis med AI</p>
      </div>
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-stone-200 p-6 flex flex-col items-center gap-4">
        <label className="w-full h-56 rounded-xl bg-stone-100 border-2 border-dashed border-stone-300 flex flex-col items-center justify-center text-stone-400 cursor-pointer hover:bg-stone-50 transition">
          {image ? (
            <img
              src={`data:${mimeType};base64,${image}`}
              alt="Uppladdad bild"
              className="h-full w-full object-contain rounded-xl"
            />
          ) : (
            <>
              <span className="text-5xl mb-2">📷</span>
              <span className="text-sm">Tryck för att ladda upp bild</span>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </label>
        <button
          onClick={analyzeImage}
          disabled={!image || loading}
          className="w-full bg-stone-800 text-white rounded-xl py-3 font-semibold hover:bg-stone-700 transition disabled:opacity-40"
        >
          {loading ? "Analyserar..." : "Värdera föremålet"}
        </button>
      </div>
      <div className="w-full max-w-md mt-6 bg-white rounded-2xl shadow-sm border border-stone-200 p-6">
        <h2 className="text-lg font-semibold text-stone-700 mb-2">Resultat</h2>
        {result ? (
          <p className="text-stone-600 text-sm whitespace-pre-wrap">{result}</p>
        ) : (
          <p className="text-stone-400 text-sm">Ladda upp en bild så analyserar AI:n ditt föremål här.</p>
        )}
      </div>
    </main>
  );
}
