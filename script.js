document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('fileInput');
    const passwordInput = document.getElementById('passwordInput');
    const convertBtn = document.getElementById('convertBtn');
    const downloadLink = document.getElementById('downloadLink');

    convertBtn.addEventListener('click', async () => {
        const selectedFile = fileInput.files[0];
        const password = passwordInput.value;

        if (selectedFile && password) {
            const reader = new FileReader();
            reader.onload = async () => {
                const imageBytes = reader.result;

                // Create a PDF document
                const pdfDoc = await PDFLib.PDFDocument.create();
                const page = pdfDoc.addPage([600, 400]);
                const contentStream = PDFLib.PDFContentStream.of(page);
                contentStream.drawImage(await pdfDoc.embedPng(imageBytes), {
                    x: 50,
                    y: 150,
                    width: 500,
                    height: 200,
                });
                page.addContentStreams(contentStream);

                // Encrypt the PDF with the password
                const pdfBytes = await pdfDoc.save({ password });

                // Create a Blob and provide a download link
                const blob = new Blob([pdfBytes], { type: 'application/pdf' });
                const url = window.URL.createObjectURL(blob);

                downloadLink.href = url;
                downloadLink.style.display = 'block';
            };

            reader.readAsArrayBuffer(selectedFile);
        }
    });
});
