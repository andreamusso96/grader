// PreviewPage – aligned MCQ option text & checkbox, keeps margins & pagination

'use client';

import { useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useExamStore } from '@/store/useExamStore';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/* ---- Layout ---- */
const A4_WIDTH_PX = 794; // 210 mm @ 96 dpi
const PT_TO_PX = 96 / 72;
const MARGIN_PT = 40; // 0.56 in all sides
const MARGIN_PX = MARGIN_PT * PT_TO_PX; // ~53 px
const CONTENT_WIDTH_PX = A4_WIDTH_PX - 2 * MARGIN_PX;

export default function PreviewPage() {
  const { id } = useParams<{ id: string }>();
  const exam = useExamStore((s) => s.exams[id]);
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  if (!exam) return <p className="p-4">Exam not found.</p>;

  /* -------- PDF Export -------- */
  const exportPDF = async () => {
    if (!ref.current) return;

    const scale = 2;
    const srcCanvas = await html2canvas(ref.current, {
      scale,
      backgroundColor: '#ffffff',
      width: CONTENT_WIDTH_PX,
      windowWidth: CONTENT_WIDTH_PX,
      scrollY: -window.scrollY,
      useCORS: true,
    });

    const pdf = new jsPDF({ unit: 'pt', format: 'a4', orientation: 'p' });
    const pageWpt = pdf.internal.pageSize.getWidth();
    const pageHpt = pdf.internal.pageSize.getHeight();
    const usableWpt = pageWpt - 2 * MARGIN_PT;
    const usableHpt = pageHpt - 2 * MARGIN_PT;

    const px2pt = usableWpt / srcCanvas.width;
    const sliceHeightPx = usableHpt / px2pt;

    let renderedPx = 0;
    while (renderedPx < srcCanvas.height) {
      const sliceCanvas = document.createElement('canvas');
      sliceCanvas.width = srcCanvas.width;
      sliceCanvas.height = Math.min(sliceHeightPx, srcCanvas.height - renderedPx);
      const ctx = sliceCanvas.getContext('2d')!;
      ctx.drawImage(
        srcCanvas,
        0,
        renderedPx,
        srcCanvas.width,
        sliceCanvas.height,
        0,
        0,
        srcCanvas.width,
        sliceCanvas.height
      );

      pdf.addImage(
        sliceCanvas.toDataURL('image/png'),
        'PNG',
        MARGIN_PT,
        MARGIN_PT,
        usableWpt,
        sliceCanvas.height * px2pt
      );

      renderedPx += sliceHeightPx;
      if (renderedPx < srcCanvas.height) pdf.addPage();
    }

    pdf.save(`${exam.title}.pdf`);
  };

  /* -------- UI -------- */
  return (
    <div className="mx-auto max-w-2xl p-4">
      <button onClick={() => router.back()} className="mb-4 underline">
        ← Back
      </button>

      {/* Printable content area */}
      <div
        ref={ref}
        style={{ width: `${CONTENT_WIDTH_PX}px` }}
        className="sheet mx-auto bg-white p-6 text-black"
      >
        <h2 className="mb-6 text-center text-xl font-bold">{exam.title}</h2>

        {exam.questions.map((q, idx) => (
          <div key={q.id} className="mb-6 break-inside-avoid">
            <p className="mb-2 text-lg font-semibold">
              {idx + 1}. {q.text}
            </p>

            {/* MCQ */}
            {q.qType === 'mcq'
              ? [...Array(q.length)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3 leading-tight">
                    <div className="h-5 w-5 flex-shrink-0 border-2 border-black" />
                    <span className="text-base">Option {i + 1}</span>
                  </div>
                ))
              /* Open question */
              : [...Array(q.length)].map((_, i) => (
                  <div key={i} className="my-2 h-5 w-full border-b border-black" />
                ))}
          </div>
        ))}
      </div>

      <button
        onClick={exportPDF}
        className="mt-6 rounded bg-black px-4 py-2 text-white"
      >
        Export PDF
      </button>
    </div>
  );
}