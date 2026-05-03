"use client"

export default function DownloadPage() {
  const links = [
    {
      name: "STC Pay",
      url: "/",
      color: "#4f1b7b",
    },
    {
      name: "Zain",
      url: "/zain",
      color: "#00a651",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4" dir="rtl">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">روابط التطبيقات</h1>
        
        <div className="space-y-4">
          {links.map((link) => (
            <a
              key={link.name}
              href={link.url}
              className="flex items-center justify-between p-4 rounded-xl text-white font-semibold transition-transform hover:scale-105"
              style={{ backgroundColor: link.color }}
            >
              <span>{link.name}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
