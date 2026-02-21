import LoginButton from "@/components/LoginButton";

export default function LandingPage() {
  return (
    <section className="mx-auto mt-24 max-w-xl rounded-lg bg-panel p-8 text-center shadow-lg">
      <h1 className="mb-3 text-4xl font-bold">CodeClash AI</h1>
      <p className="mb-6 text-gray-300">1v1 Python battles with secure evaluation.</p>
      <LoginButton />
    </section>
  );
}
