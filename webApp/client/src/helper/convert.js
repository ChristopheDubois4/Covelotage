/** image into base64 */
export default function convertToBase64(file) {

    /**
     * cf https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Promise
     */
    return new Promise((resolve, reject) => {

        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);

        fileReader.onload = () => {
            // Make an image square by cropping the smaller side
            const image = new Image();
            image.src = fileReader.result;

            image.onload = () => {
                const size = Math.min(image.width, image.height);
                const canvas = document.createElement('canvas');
                canvas.width = size;
                canvas.height = size;
                const context = canvas.getContext('2d');
                context.drawImage(image, (image.width - size) / 2, (image.height - size) / 2, size, size, 0, 0, size, size);
                // Use canvas.toDataURL to obtain the URL of the cropped image
                resolve(canvas.toDataURL('image/jpeg'));
            };
        }
        fileReader.onerror = (error) => {
            reject(error)
        }
    })
}