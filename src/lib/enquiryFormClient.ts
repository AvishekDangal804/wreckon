const MAX_PHOTO_BYTES = 8 * 1024 * 1024;

function statusColors(dark: boolean) {
  return dark
    ? { neutral: "text-ink-100", success: "text-amber-300", error: "text-amber-200" }
    : { neutral: "text-ink-600", success: "text-green-700", error: "text-red-700" };
}

function validatePhotos(input: HTMLInputElement, status: HTMLElement | null, dark: boolean): boolean {
  const files = input.files ? Array.from(input.files) : [];
  for (const file of files) {
    if (!file.type.startsWith("image/") || file.size > MAX_PHOTO_BYTES) {
      if (status) {
        status.textContent = "Photos must be images under 8MB each.";
        status.className = `form-status mt-3 text-sm ${statusColors(dark).error}`;
      }
      input.value = "";
      return false;
    }
  }
  return true;
}

export function initEnquiryForms() {
  document.querySelectorAll<HTMLFormElement>(".enquiry-form").forEach((formEl) => {
    const status = formEl.querySelector(".form-status") as HTMLElement | null;
    const submitBtn = formEl.querySelector('button[type="submit"]') as HTMLButtonElement | null;
    const photoInput = formEl.querySelector<HTMLInputElement>('input[type="file"][name="photos"]');
    const dark = formEl.dataset.dark === "true";
    const colors = statusColors(dark);

    photoInput?.addEventListener("change", () => validatePhotos(photoInput, status, dark));

    formEl.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (photoInput && !validatePhotos(photoInput, status, dark)) return;

      if (submitBtn) submitBtn.disabled = true;
      if (status) {
        status.textContent = "Sending…";
        status.className = `form-status mt-3 text-sm ${colors.neutral}`;
      }

      try {
        const res = await fetch("/api/enquiry", {
          method: "POST",
          body: new FormData(formEl),
        });
        const data = await res.json();

        if (res.ok) {
          if (status) {
            status.textContent = data.message ?? "Thanks — we've received your enquiry.";
            status.className = `form-status mt-3 text-sm ${colors.success}`;
          }
          formEl.reset();
        } else {
          if (status) {
            status.textContent = data.message ?? "Something went wrong. Please call us instead.";
            status.className = `form-status mt-3 text-sm ${colors.error}`;
          }
        }
      } catch {
        if (status) {
          status.textContent = "Something went wrong. Please call us instead.";
          status.className = `form-status mt-3 text-sm ${colors.error}`;
        }
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  });
}
