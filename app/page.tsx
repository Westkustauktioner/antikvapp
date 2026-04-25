"use client";
import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState("image/jpeg");
  const [result, setResult] = useState("");
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

  function formatResult(text: string) {
    return text
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/^## (.+)$/gm, "<h2 style='font-size:16px;font-weight:600;margin:16px 0 8px'>$1</h2>")
      .replace(/^# (.+)$/gm, "<h1 style='font-size:18px;font-weight:700;margin:16px 0 8px'>$1</h1>")
      .replace(/---/g, "<hr style='margin:12px 0'/>")
      .replace(/\n/g, "<br/>");
  }

  return (
    <main style={{minHeight:"100vh",background:"#fafaf9",display:"flex",flexDirection:"column",alignItems:"center",padding:"40px 16px"}}>
      <div style={{width:"100%",maxWidth:"448px",marginBottom:"32px",display:"flex",flexDirection:"column",alignItems:"center"}}>
        <Image src="/logo.png" alt="Westkustauktioner" width={400} height={120} style={{width:"100%",objectFit:"contain",borderRadius:"12px"}} priority />
        <p style={{color:"#78716c",marginTop:"12px",fontSize:"14px"}}>Värdera ditt föremål gratis med AI</p>
      </div>
      <div style={{width:"100%",maxWidth:"448px",background:"white",borderRadius:"16px",border:"1px solid #e7e5e4",padding:"24px",display:"flex",flexDirection:"column",alignItems:"center",gap:"16px"}}>
        <label style={{width:"100%",height:"224px",borderRadius:"12px",background:"#f5f5f4",border:"2px dashed #d6d3d1",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",color:"#a8a29e",cursor:"pointer"}}>
          {image ? (
            <img src={"data:" + mimeType + ";base64," + image} alt="Uppladdad bild" style={{height:"100%",width:"100%",objectFit:"contain",borderRadius:"12px"}} />
          ) : (
            <div style={{textAlign:"center"}}>
              <div style={{fontSize:"48px",marginBottom:"8px"}}>📷</div>
              <div style={{fontSize:"14px"}}>Tryck för att ladda upp bild</div>
            </div>
          )}
          <input type="file" accept="image/*" style={{display:"none"}} onChange={handleImageUpload} />
        </label>
        <button onClick={analyzeImage} disabled={!image || loading} style={{width:"100%",background:"#292524",color:"white",borderRadius:"12px",padding:"12px",fontWeight:"600",border:"none",cursor:"pointer"}}>
          {loading ? "Analyserar..." : "Värdera föremålet"}
        </button>
      </div>
      <div style={{width:"100%",maxWidth:"448px",marginTop:"24px",background:"white",borderRadius:"16px",border:"1px solid #e7e5e4",padding:"24px"}}>
        <h2 style={{fontSize:"18px",fontWeight:"600",color:"#44403c",marginBottom:"8px"}}>Resultat</h2>
        {result ? (
          <div style={{color:"#57534e",fontSize:"14px",lineHeight:"1.6"}} dangerouslySetInnerHTML={{__html: formatResult(result)}} />
        ) : (
          <p style={{color:"#a8a29e",fontSize:"14px"}}>Ladda upp en bild så analyserar AI:n ditt föremål här.</p>
        )}
      </div>
    </main>
  );
}