"use client";

export default function NewsletterSection() {
  return (
    <section className="py-24 bg-accent relative overflow-hidden">
      <div className="absolute inset-0 bg-black/20" />
      <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white mb-4">
          Join The Cult
        </h2>
        <p className="text-white/80 uppercase tracking-widest text-sm mb-8 font-medium">
          Get exclusive access to limited drops, early releases, and behind-the-scenes content.
        </p>
        <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
          <input
            type="email"
            placeholder="ENTER YOUR EMAIL"
            className="flex-1 bg-white/10 border border-white/20 text-white placeholder:text-white/50 px-6 py-4 rounded-full focus:outline-none focus:border-white focus:bg-white/20 transition-colors uppercase tracking-widest text-sm"
          />
          <button className="px-8 py-4 bg-white text-accent rounded-full font-bold uppercase tracking-wider hover:bg-black hover:text-white transition-colors">
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
