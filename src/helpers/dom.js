export const isPassiveListenersSupported = () => {
  let passiveSupported = false;
  try {
    window.addEventListener(
      'test',
      null,
      Object.defineProperty({}, 'passive', {
        get() {
          passiveSupported = true;
          return false;
        },
      }),
    );
  } catch (err) {
    // eslint-disable-next-line
    console.warn('passive listeners not supported in current browser');
  }
  return passiveSupported;
};

/**
 * Converts dataUrl to Blob
 * @note not use it for urlencoded dataURLs
 * @param { string } dataURL
 * @returns { Blob }
 */
function dataURLtoBlob(dataURL) {
  const [typeInfo, bytes] = dataURL.split(',');

  const byteString = atob(bytes);
  const [, mimeString] = /:(.*);/.exec(typeInfo);
  const u8Array = new Uint8Array(byteString.length);

  for (let i = 0; i < byteString.length; i += 1) {
    u8Array[i] = byteString[i];
  }

  return new Blob([u8Array], { type: mimeString });
}

/**
 * Emulates user click on link with given dataUrl
 * @param { string } dataUrl - dataUrl file to save
 * @param { string } fileName - custom filename for saved file, by default current ISO date string
 */
export const triggerDownloadDataUrl = (
  dataUrl,
  fileName = new Date().toISOString(),
) => {
  const name = fileName || `${new Date().toISOString()}`;

  if (window.navigator.msSaveOrOpenBlob) {
    const blob = dataURLtoBlob(dataUrl);
    window.navigator.msSaveBlob(blob, name);
    return;
  }

  const tmpLink = window.document.createElement('a');
  tmpLink.href = dataUrl;
  tmpLink.download = name;
  document.body.appendChild(tmpLink);
  tmpLink.click();
  document.body.removeChild(tmpLink);
};
