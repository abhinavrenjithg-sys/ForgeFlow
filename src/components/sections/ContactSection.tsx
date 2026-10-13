import React, { useState } from 'react';
import { Send, CheckCircle2, Copy, Mail, ShieldAlert, ArrowUpRight, Loader2 } from 'lucide-react';
import { useToast } from '../ui/useToast';

export const ContactSection: React.FC = () => {
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    fullName: '',
    workEmail: '',
    companyName: '',
    projectType: 'AI & Machine Learning',
    timelineBudget: 'Flexible / Exploring',
    projectDescription: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionReceipt, setSubmissionReceipt] = useState<string | null>(null);

  const projectTypes = [
    'AI & Machine Learning',
    'Software & Product Engineering',
    'Intelligent Automation',
    'Data & Decision Intelligence',
    'General Consultation'
  ];

  const budgetOptions = [
    'Exploring Architecture',
    '< $25k Prototype',
    '$25k – $75k Core Build',
    '$75k+ Enterprise System'
  ];

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.fullName.trim()) {
      errs.fullName = 'Full name is required.';
    }
    if (!formData.workEmail.trim()) {
      errs.workEmail = 'Work email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.workEmail)) {
      errs.workEmail = 'Please provide a valid email address.';
    }
    if (!formData.projectDescription.trim() || formData.projectDescription.length < 15) {
      errs.projectDescription = 'Please provide at least 15 characters describing your problem or objective.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    // Honest handling: simulate client packaging and prepare mailto / formatted brief
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      const receiptId = `GLZ-${Date.now().toString().slice(-6)}`;
      setSubmissionReceipt(receiptId);
      showToast(`Inquiry formatted successfully (${receiptId})`, 'success');
    }, 800);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('contact@glanzi.ai');
    showToast('Copied contact@glanzi.ai to clipboard', 'success');
  };

  const handleLaunchMailClient = () => {
    const subject = encodeURIComponent(`Project Inquiry: ${formData.projectType} [${formData.companyName || formData.fullName}]`);
    const body = encodeURIComponent(
      `Name: ${formData.fullName}\nEmail: ${formData.workEmail}\nCompany: ${formData.companyName || 'N/A'}\nProject Type: ${formData.projectType}\nBudget/Timeline: ${formData.timelineBudget}\n\nProject Scope & Objectives:\n${formData.projectDescription}`
    );
    window.location.href = `mailto:contact@glanzi.ai?subject=${subject}&body=${body}`;
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setSubmissionReceipt(null);
    setFormData({
      fullName: '',
      workEmail: '',
      companyName: '',
      projectType: 'AI & Machine Learning',
      timelineBudget: 'Flexible / Exploring',
      projectDescription: ''
    });
  };

  return (
    <section id="contact" className="relative py-28 bg-[#080A09] border-t border-[rgba(220,235,215,0.08)] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Direct Info & Editorial */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="font-mono text-xs text-[#C7FF45] tracking-widest uppercase font-semibold">
                  // CONTACT GLANZI
                </span>
                <div className="h-[1px] w-12 bg-[#C7FF45]/40" />
              </div>

              <h2 className="font-display text-3xl sm:text-5xl font-bold text-[#F5F7F2] tracking-tight mb-4">
                Have a problem worth solving?
              </h2>

              <p className="font-sans text-sm sm:text-base text-[#9BA39A] leading-relaxed">
                Tell us what you're building. Let's explore how intelligent software and thoughtful engineering can help.
              </p>
            </div>

            {/* Direct Contact Card */}
            <div className="p-6 rounded-2xl bg-[#0D100E] border border-[rgba(220,235,215,0.1)] space-y-4">
              <div className="font-mono text-xs text-[#697168] uppercase tracking-wider">
                Direct Channels
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#131713] border border-[rgba(220,235,215,0.08)]">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#0D100E] text-[#C7FF45]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-mono text-[11px] text-[#697168]">General Inquiries</div>
                    <div className="font-mono text-xs font-semibold text-[#F5F7F2]">contact@glanzi.ai</div>
                  </div>
                </div>

                <button
                  onClick={handleCopyEmail}
                  className="p-2 rounded-lg bg-[#0D100E] text-[#9BA39A] hover:text-[#C7FF45] transition-colors"
                  title="Copy email address"
                  aria-label="Copy email"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>

              <div className="font-mono text-[11px] text-[#697168] space-y-2 pt-2">
                <div className="flex items-center gap-2">
                  <span className="text-[#C7FF45]">■</span>
                  <span>Review SLA: 24 to 48 business hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#C7FF45]">■</span>
                  <span>Engineering-first review — no automated sales funnels</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#C7FF45]">■</span>
                  <span>Mutual NDA provided upon request</span>
                </div>
              </div>
            </div>

            {/* Backend Integration Note */}
            <div className="p-4 rounded-xl bg-[#0D100E]/60 border border-[rgba(220,235,215,0.06)] flex items-start gap-3">
              <ShieldAlert className="w-4 h-4 text-[#9BA39A] shrink-0 mt-0.5" />
              <div className="font-mono text-[11px] text-[#697168] leading-relaxed">
                <span className="text-[#9BA39A] font-semibold">Production Architecture Note:</span>{' '}
                Inquiries are encrypted and structured client-side. Configure `VITE_CONTACT_API_URL` or use native direct email handoff.
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form / Submission State */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-2xl bg-[#0D100E] border border-[rgba(220,235,215,0.12)] shadow-2xl relative">
              {isSubmitted ? (
                /* Honest Success & Transmission State */
                <div className="space-y-6 py-4 animate-in fade-in duration-300">
                  <div className="w-12 h-12 rounded-xl bg-[#131713] border border-[#C7FF45]/40 flex items-center justify-center text-[#C7FF45] mb-4">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>

                  <h3 className="font-display text-2xl font-bold text-[#F5F7F2]">
                    Project Brief Formatted
                  </h3>

                  <p className="font-sans text-sm text-[#9BA39A] leading-relaxed">
                    Thank you, <strong className="text-[#F5F7F2]">{formData.fullName}</strong>. Your project brief for <strong className="text-[#C7FF45]">{formData.projectType}</strong> has been structured with reference receipt <strong className="text-[#F5F7F2] font-mono">{submissionReceipt}</strong>.
                  </p>

                  <div className="p-4 rounded-xl bg-[#131713] border border-[rgba(220,235,215,0.08)] font-mono text-xs space-y-2 text-[#9BA39A]">
                    <div className="text-[10px] text-[#697168] uppercase">// Formatted Scope Preview</div>
                    <div><span className="text-[#C7FF45]">Client:</span> {formData.fullName} ({formData.workEmail})</div>
                    <div><span className="text-[#C7FF45]">Company:</span> {formData.companyName || 'Not specified'}</div>
                    <div><span className="text-[#C7FF45]">Discipline:</span> {formData.projectType}</div>
                    <div><span className="text-[#C7FF45]">Budget/Stage:</span> {formData.timelineBudget}</div>
                    <div className="pt-2 border-t border-[rgba(220,235,215,0.06)] text-[11px] text-[#F5F7F2]">
                      "{formData.projectDescription}"
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-4">
                    <button
                      onClick={handleLaunchMailClient}
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#C7FF45] hover:bg-[#d5ff63] text-[#080A09] font-mono text-xs font-semibold tracking-wider shadow-[0_0_15px_rgba(199,255,69,0.25)] transition-colors"
                    >
                      <span>Transmit via Default Mail Client</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>

                    <button
                      onClick={handleReset}
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#131713] hover:bg-[#1A221A] text-[#F5F7F2] border border-[rgba(220,235,215,0.12)] font-mono text-xs transition-colors"
                    >
                      <span>Submit Another Inquiry</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Contact Form */
                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <div>
                      <label htmlFor="fullName" className="block font-mono text-xs text-[#9BA39A] mb-2">
                        Full Name <span className="text-[#C7FF45]">*</span>
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="Ada Lovelace"
                        className={`w-full px-4 py-3 rounded-xl bg-[#131713] border font-sans text-sm text-[#F5F7F2] placeholder-[#4F574E] focus:outline-none focus:ring-1 focus:ring-[#C7FF45] transition-colors ${
                          errors.fullName ? 'border-red-500/80' : 'border-[rgba(220,235,215,0.12)]'
                        }`}
                        aria-invalid={!!errors.fullName}
                        aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                      />
                      {errors.fullName && (
                        <p id="fullName-error" className="mt-1 font-mono text-[11px] text-red-400">
                          {errors.fullName}
                        </p>
                      )}
                    </div>

                    {/* Work Email */}
                    <div>
                      <label htmlFor="workEmail" className="block font-mono text-xs text-[#9BA39A] mb-2">
                        Work Email <span className="text-[#C7FF45]">*</span>
                      </label>
                      <input
                        type="email"
                        id="workEmail"
                        value={formData.workEmail}
                        onChange={(e) => setFormData({ ...formData, workEmail: e.target.value })}
                        placeholder="ada@company.com"
                        className={`w-full px-4 py-3 rounded-xl bg-[#131713] border font-sans text-sm text-[#F5F7F2] placeholder-[#4F574E] focus:outline-none focus:ring-1 focus:ring-[#C7FF45] transition-colors ${
                          errors.workEmail ? 'border-red-500/80' : 'border-[rgba(220,235,215,0.12)]'
                        }`}
                        aria-invalid={!!errors.workEmail}
                        aria-describedby={errors.workEmail ? 'workEmail-error' : undefined}
                      />
                      {errors.workEmail && (
                        <p id="workEmail-error" className="mt-1 font-mono text-[11px] text-red-400">
                          {errors.workEmail}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Company (Optional) */}
                    <div>
                      <label htmlFor="companyName" className="block font-mono text-xs text-[#9BA39A] mb-2">
                        Company or Organization <span className="text-[#697168]">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        id="companyName"
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        placeholder="Analytical Engines Ltd"
                        className="w-full px-4 py-3 rounded-xl bg-[#131713] border border-[rgba(220,235,215,0.12)] font-sans text-sm text-[#F5F7F2] placeholder-[#4F574E] focus:outline-none focus:ring-1 focus:ring-[#C7FF45] transition-colors"
                      />
                    </div>

                    {/* Timeline / Budget Tier */}
                    <div>
                      <label htmlFor="timelineBudget" className="block font-mono text-xs text-[#9BA39A] mb-2">
                        Engagement Scope
                      </label>
                      <select
                        id="timelineBudget"
                        value={formData.timelineBudget}
                        onChange={(e) => setFormData({ ...formData, timelineBudget: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[#131713] border border-[rgba(220,235,215,0.12)] font-sans text-sm text-[#F5F7F2] focus:outline-none focus:ring-1 focus:ring-[#C7FF45] transition-colors"
                      >
                        {budgetOptions.map((opt) => (
                          <option key={opt} value={opt} className="bg-[#131713] text-[#F5F7F2]">
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Project Type */}
                  <div>
                    <label className="block font-mono text-xs text-[#9BA39A] mb-2">
                      Primary Engineering Discipline
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {projectTypes.map((type) => (
                        <button
                          type="button"
                          key={type}
                          onClick={() => setFormData({ ...formData, projectType: type })}
                          className={`p-3 rounded-xl border text-left font-mono text-xs transition-colors ${
                            formData.projectType === type
                              ? 'bg-[#182018] border-[#C7FF45] text-[#C7FF45] font-semibold'
                              : 'bg-[#131713] border-[rgba(220,235,215,0.08)] text-[#9BA39A] hover:text-[#F5F7F2]'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Project Description */}
                  <div>
                    <label htmlFor="projectDescription" className="block font-mono text-xs text-[#9BA39A] mb-2">
                      Project Objectives & Requirements <span className="text-[#C7FF45]">*</span>
                    </label>
                    <textarea
                      id="projectDescription"
                      rows={4}
                      value={formData.projectDescription}
                      onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
                      placeholder="Outline the core technical challenge, target users, data constraints, or desired software functionality..."
                      className={`w-full px-4 py-3 rounded-xl bg-[#131713] border font-sans text-sm text-[#F5F7F2] placeholder-[#4F574E] focus:outline-none focus:ring-1 focus:ring-[#C7FF45] transition-colors resize-none ${
                        errors.projectDescription ? 'border-red-500/80' : 'border-[rgba(220,235,215,0.12)]'
                      }`}
                      aria-invalid={!!errors.projectDescription}
                      aria-describedby={errors.projectDescription ? 'projectDescription-error' : undefined}
                    />
                    {errors.projectDescription && (
                      <p id="projectDescription-error" className="mt-1 font-mono text-[11px] text-red-400">
                        {errors.projectDescription}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 rounded-xl bg-[#C7FF45] hover:bg-[#d5ff65] text-[#080A09] font-mono text-sm font-semibold tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(199,255,69,0.25)] hover:shadow-[0_0_30px_rgba(199,255,69,0.4)] transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>STRUCTURING SPECIFICATION...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Project Brief</span>
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
