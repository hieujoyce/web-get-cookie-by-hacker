const btnDownload = document.querySelector("#btn-download");

btnDownload.addEventListener("click", async () => {
  try {
    const res = await fetch("/download");
    const data = await res.blob();
    const a = document.createElement("a");
    a.href = window.URL.createObjectURL(data);
    a.download = "get.txt";
    a.click();
  } catch (error) {}
});
