// src/components/layout/Footer.jsx
export default function Footer() {
  return (
    <footer className="bg-white border-t p-4 text-center text-gray-600 text-sm">
      <p>© {new Date().getFullYear()} MentalHealth+. All rights reserved.</p>
    </footer>
  );
}