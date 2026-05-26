"use client";

import DomeGallerySphere from "./DomeGallerySphere";

export default function DomeGallery() {
  return (
    <section className="py-24 bg-background overflow-hidden relative hidden md:block">
      <div className="text-center mb-16 px-4">
        <h2 className="text-4xl md:text-5xl font-bold uppercase text-foreground mb-4">
          The Inspiration
        </h2>
        <p className="text-foreground/70 uppercase tracking-widest text-sm">
          Legends of Telugu Cinema
        </p>
      </div>

      <div className="w-full h-[600px] sm:h-[800px] relative max-w-[100vw]">
        <DomeGallerySphere
          fit={0.8}
          minRadius={300}
          maxVerticalRotationDeg={0}
          segments={34}
          dragDampening={2}
          grayscale={true}
        />
      </div>
    </section>
  );
}
