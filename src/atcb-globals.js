/*!
 *  @preserve
 *
 *  ++++++++++++++++++++++
 *  Add to Calendar Button
 *  ++++++++++++++++++++++
 *
 *  Version: 1.17.0
 *  Creator: Jens Kuerschner (https://jenskuerschner.de)
 *  Project: https://github.com/add2cal/add-to-calendar-button
 *  License: Apache-2.0 with “Commons Clause” License Condition v1.0
 *  Note:    DO NOT REMOVE THE COPYRIGHT NOTICE ABOVE!
 *
 */
const atcbVersion = '1.17.0';

// CHECKING FOR SPECIFIC DEVICED AND SYSTEMS
// browser
const isBrowser = () => {
  if (typeof window === 'undefined') {
    return false;
  } else {
    return true;
  }
};
// iOS
const isiOS = isBrowser()
  ? () => {
      if (
        (/iPad|iPhone|iPod/i.test(navigator.userAgent || navigator.vendor || window.opera) &&
          !window.MSStream) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
      ) {
        return true;
      } else {
        return false;
      }
    }
  : () => {
      return false;
    };
// Android
const isAndroid = isBrowser()
  ? () => {
      if (/android/i.test(navigator.userAgent || navigator.vendor || window.opera) && !window.MSStream) {
        return true;
      } else {
        return false;
      }
    }
  : () => {
      return false;
    };
// Chrome
const isChrome = isBrowser()
  ? () => {
      if (/chrome|chromium|crios/i.test(navigator.userAgent)) {
        return true;
      } else {
        return false;
      }
    }
  : () => {
      return false;
    };
// Mobile
const isMobile = () => {
  if (isAndroid() || isiOS()) {
    return true;
  } else {
    return false;
  }
};
// WebView (iOS and Android)
const isWebView = isBrowser()
  ? () => {
      if (
        /(; ?wv|(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari))/i.test(navigator.userAgent || navigator.vendor)
      ) {
        return true;
      } else {
        return false;
      }
    }
  : () => {
      return false;
    };
// checking for problematic apps
const isProblematicWebView = isBrowser()
  ? () => {
      if (/(Instagram)/i.test(navigator.userAgent || navigator.vendor || window.opera)) {
        return true;
      } else {
        return false;
      }
    }
  : () => {
      return false;
    };

// DEFINE GLOBAL VARIABLES
const atcbDefaultTarget = isWebView() ? '_system' : '_blank';
const atcbOptions = ['apple', 'google', 'ical', 'ms365', 'outlookcom', 'msteams', 'yahoo'];
const atcbValidRecurrOptions = ['apple', 'google', 'ical'];
const atcbInvalidSubscribeOptions = ['msteams'];
const atcbiOSInvalidOptions = ['ical'];
const atcbStates = [];

// DEFINING GLOBAL ICONS
const atcbIcon = {
  trigger:
    '<span class="atcb-icon-trigger"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200.016"><path d="M132.829 7.699c0-4.248 4.199-7.699 9.391-7.699s9.391 3.451 9.391 7.699v33.724c0 4.248-4.199 7.699-9.391 7.699s-9.391-3.451-9.391-7.699zm-5.941 123.747c2.979 0 5.404 2.425 5.404 5.404s-2.425 5.404-5.404 5.404l-21.077-.065-.065 21.045c0 2.979-2.425 5.404-5.404 5.404s-5.404-2.425-5.404-5.404l.065-21.061-21.045-.081c-2.979 0-5.404-2.425-5.404-5.404s2.425-5.404 5.404-5.404l21.061.065.065-21.045c0-2.979 2.425-5.404 5.404-5.404s5.404 2.425 5.404 5.404l-.065 21.077 21.061.065zM48.193 7.699C48.193 3.451 52.393 0 57.585 0s9.391 3.451 9.391 7.699v33.724c0 4.248-4.199 7.699-9.391 7.699s-9.391-3.451-9.391-7.699zM10.417 73.763h179.167V34.945c0-1.302-.537-2.49-1.4-3.369-.863-.863-2.051-1.4-3.369-1.4h-17.171c-2.881 0-5.208-2.327-5.208-5.208s2.327-5.208 5.208-5.208h17.171c4.183 0 7.975 1.709 10.726 4.46S200 30.762 200 34.945v44.043 105.843c0 4.183-1.709 7.975-4.46 10.726s-6.543 4.46-10.726 4.46H15.186c-4.183 0-7.975-1.709-10.726-4.46C1.709 192.79 0 188.997 0 184.814V78.988 34.945c0-4.183 1.709-7.975 4.46-10.726s6.543-4.46 10.726-4.46h18.343c2.881 0 5.208 2.327 5.208 5.208s-2.327 5.208-5.208 5.208H15.186c-1.302 0-2.49.537-3.369 1.4-.863.863-1.4 2.051-1.4 3.369zm179.167 10.433H10.417v100.618c0 1.302.537 2.49 1.4 3.369.863.863 2.051 1.4 3.369 1.4h169.629c1.302 0 2.49-.537 3.369-1.4.863-.863 1.4-2.051 1.4-3.369zM82.08 30.176c-2.881 0-5.208-2.327-5.208-5.208s2.327-5.208 5.208-5.208h34.977c2.881 0 5.208 2.327 5.208 5.208s-2.327 5.208-5.208 5.208z"/></svg></span>',
  apple:
    '<span class="atcb-icon-apple"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 245.657"><path d="M167.084 130.514c-.308-31.099 25.364-46.022 26.511-46.761-14.429-21.107-36.91-24.008-44.921-24.335-19.13-1.931-37.323 11.27-47.042 11.27-9.692 0-24.67-10.98-40.532-10.689-20.849.308-40.07 12.126-50.818 30.799-21.661 37.581-5.54 93.281 15.572 123.754 10.313 14.923 22.612 31.688 38.764 31.089 15.549-.612 21.433-10.073 40.242-10.073s24.086 10.073 40.546 9.751c16.737-.308 27.34-15.214 37.585-30.187 11.855-17.318 16.714-34.064 17.009-34.925-.372-.168-32.635-12.525-32.962-49.68l.045-.013zm-30.917-91.287C144.735 28.832 150.524 14.402 148.942 0c-12.344.503-27.313 8.228-36.176 18.609-7.956 9.216-14.906 23.904-13.047 38.011 13.786 1.075 27.862-7.004 36.434-17.376z"/></svg></span>',
  google:
    '<span class="atcb-icon-google"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><path d="M152.637 47.363H47.363v105.273h105.273z" fill="#fff"/><path d="M152.637 200L200 152.637h-47.363z" fill="#f72a25"/><path d="M200 47.363h-47.363v105.273H200z" fill="#fbbc04"/><path d="M152.637 152.637H47.363V200h105.273z" fill="#34a853"/><path d="M0 152.637v31.576A15.788 15.788 0 0 0 15.788 200h31.576v-47.363z" fill="#188038"/><path d="M200 47.363V15.788A15.79 15.79 0 0 0 184.212 0h-31.575v47.363z" fill="#1967d2"/><path d="M15.788 0A15.79 15.79 0 0 0 0 15.788v136.849h47.363V47.363h105.274V0z" fill="#4285f4"/><path d="M68.962 129.02c-3.939-2.653-6.657-6.543-8.138-11.67l9.131-3.76c.83 3.158 2.279 5.599 4.346 7.341 2.051 1.742 4.557 2.588 7.471 2.588 2.995 0 5.55-.911 7.699-2.718 2.148-1.823 3.223-4.134 3.223-6.934 0-2.865-1.139-5.208-3.402-7.031s-5.111-2.718-8.496-2.718h-5.273v-9.033h4.736c2.913 0 5.387-.781 7.389-2.376 2.002-1.579 2.995-3.743 2.995-6.494 0-2.441-.895-4.395-2.686-5.859s-4.053-2.197-6.803-2.197c-2.686 0-4.818.716-6.396 2.148s-2.767 3.255-3.451 5.273l-9.033-3.76c1.204-3.402 3.402-6.396 6.624-8.984s7.34-3.89 12.337-3.89c3.695 0 7.031.716 9.977 2.148s5.257 3.418 6.934 5.941c1.676 2.539 2.507 5.387 2.507 8.545 0 3.223-.781 5.941-2.327 8.187-1.546 2.23-3.467 3.955-5.729 5.143v.537a17.39 17.39 0 0 1 7.34 5.729c1.904 2.572 2.865 5.632 2.865 9.212s-.911 6.771-2.718 9.57c-1.823 2.799-4.329 5.013-7.52 6.624s-6.787 2.425-10.775 2.425c-4.622 0-8.887-1.318-12.826-3.988zm56.087-45.312l-10.026 7.243-5.013-7.601 17.985-12.972h6.901v61.198h-9.847z" fill="#1a73e8"/></svg></span>',
  ical: '<span class="atcb-icon-ical"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200.016"><path d="M132.829 7.699c0-4.248 4.199-7.699 9.391-7.699s9.391 3.451 9.391 7.699v33.724c0 4.248-4.199 7.699-9.391 7.699s-9.391-3.451-9.391-7.699zm-25.228 161.263c-.553 0-.993-2.327-.993-5.208s.439-5.208.993-5.208h25.7c.553 0 .993 2.327.993 5.208s-.439 5.208-.993 5.208zm-81.803-59.766c-.553 0-.993-2.327-.993-5.208s.439-5.208.993-5.208h25.7c.553 0 .993 2.327.993 5.208s-.439 5.208-.993 5.208zm40.902 0c-.553 0-.993-2.327-.993-5.208s.439-5.208.993-5.208h25.7c.553 0 .993 2.327.993 5.208s-.439 5.208-.993 5.208zm40.902 0c-.553 0-.993-2.327-.993-5.208s.439-5.208.993-5.208h25.7c.553 0 .993 2.327.993 5.208s-.439 5.208-.993 5.208zm40.918 0c-.553 0-.993-2.327-.993-5.208s.439-5.208.993-5.208h25.7c.553 0 .993 2.327.993 5.208s-.439 5.208-.993 5.208zM25.798 139.079c-.553 0-.993-2.327-.993-5.208s.439-5.208.993-5.208h25.7c.553 0 .993 2.327.993 5.208s-.439 5.208-.993 5.208zm40.902 0c-.553 0-.993-2.327-.993-5.208s.439-5.208.993-5.208h25.7c.553 0 .993 2.327.993 5.208s-.439 5.208-.993 5.208zm40.902 0c-.553 0-.993-2.327-.993-5.208s.439-5.208.993-5.208h25.7c.553 0 .993 2.327.993 5.208s-.439 5.208-.993 5.208zm40.918 0c-.553 0-.993-2.327-.993-5.208s.439-5.208.993-5.208h25.7c.553 0 .993 2.327.993 5.208s-.439 5.208-.993 5.208zM25.798 168.962c-.553 0-.993-2.327-.993-5.208s.439-5.208.993-5.208h25.7c.553 0 .993 2.327.993 5.208s-.439 5.208-.993 5.208zm40.902 0c-.553 0-.993-2.327-.993-5.208s.439-5.208.993-5.208h25.7c.553 0 .993 2.327.993 5.208s-.439 5.208-.993 5.208zM48.193 7.699C48.193 3.451 52.393 0 57.585 0s9.391 3.451 9.391 7.699v33.724c0 4.248-4.199 7.699-9.391 7.699s-9.391-3.451-9.391-7.699zM10.417 73.763h179.15V34.945c0-1.302-.537-2.49-1.4-3.369-.863-.863-2.051-1.4-3.369-1.4h-17.155c-2.881 0-5.208-2.327-5.208-5.208s2.327-5.208 5.208-5.208h17.171c4.183 0 7.975 1.709 10.726 4.46S200 30.762 200 34.945v44.043 105.843c0 4.183-1.709 7.975-4.46 10.726s-6.543 4.46-10.726 4.46H15.186c-4.183 0-7.975-1.709-10.726-4.46C1.709 192.79 0 188.997 0 184.814V78.971 34.945c0-4.183 1.709-7.975 4.46-10.726s6.543-4.46 10.726-4.46h18.343c2.881 0 5.208 2.327 5.208 5.208s-2.327 5.208-5.208 5.208H15.186c-1.302 0-2.49.537-3.369 1.4-.863.863-1.4 2.051-1.4 3.369zm179.167 10.433H10.417v100.618c0 1.302.537 2.49 1.4 3.369.863.863 2.051 1.4 3.369 1.4h169.629c1.302 0 2.49-.537 3.369-1.4.863-.863 1.4-2.051 1.4-3.369zM82.08 30.176c-2.881 0-5.208-2.327-5.208-5.208s2.327-5.208 5.208-5.208h34.977c2.881 0 5.208 2.327 5.208 5.208s-2.327 5.208-5.208 5.208z"/></svg></span>',
  msteams:
    '<span class="atcb-icon-msteams"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 200 186.047"><path d="M195.349 39.535a20.93 20.93 0 1 1-41.86 0 20.93 20.93 0 1 1 41.86 0zm-55.847 30.233h51.66A8.84 8.84 0 0 1 200 78.605v47.056c0 17.938-14.541 32.479-32.479 32.479h0-.154c-17.938.003-32.481-14.537-32.484-32.474v-.005-51.274a4.62 4.62 0 0 1 4.619-4.619z" fill="#5059c9"/><path d="M149.614 69.767H64.34c-4.823.119-8.637 4.122-8.526 8.944v53.67c-.673 28.941 22.223 52.957 51.163 53.665 28.94-.708 51.836-24.725 51.163-53.665v-53.67c.112-4.823-3.703-8.825-8.526-8.944zm-10.079-39.535a30.233 30.233 0 0 1-60.465 0 30.233 30.233 0 0 1 60.465 0z" fill="#7b83eb"/><path opacity=".1" d="M111.628 69.767v75.209c-.023 3.449-2.113 6.547-5.302 7.86-1.015.43-2.107.651-3.209.651H59.907l-1.628-4.651c-1.628-5.337-2.459-10.885-2.465-16.465V78.698c-.112-4.815 3.697-8.811 8.512-8.93z"/><path opacity=".2" d="M106.977 69.767v79.86a8.241 8.241 0 0 1-.651 3.209c-1.313 3.189-4.412 5.279-7.86 5.302H62.093l-2.186-4.651a46.13 46.13 0 0 1-1.628-4.651 56.647 56.647 0 0 1-2.465-16.465V78.698c-.112-4.815 3.697-8.811 8.512-8.93z"/><path opacity=".2" d="M102.326 69.767v70.558a8.58 8.58 0 0 1-8.512 8.512H58.279a56.647 56.647 0 0 1-2.465-16.465V78.698c-.112-4.815 3.697-8.811 8.512-8.93z"/><path opacity=".1" d="M111.628 45.721v14.651l-2.326.093c-.791 0-1.535-.046-2.326-.093-1.57-.104-3.127-.353-4.651-.744a30.233 30.233 0 0 1-20.93-17.767 25.845 25.845 0 0 1-1.488-4.651h23.209c4.693.018 8.494 3.818 8.512 8.512z"/><use xlink:href="#B" opacity=".2" transform="scale(.08973306)"/><path d="M106.977 50.372v10c-1.57-.104-3.127-.353-4.651-.744a30.233 30.233 0 0 1-20.93-17.767h17.07c4.693.018 8.494 3.818 8.512 8.512zm0 19.395v70.558a8.58 8.58 0 0 1-8.512 8.512H58.279a56.647 56.647 0 0 1-2.465-16.465V78.698c-.112-4.815 3.697-8.811 8.512-8.93z" opacity=".2"/><path opacity=".2" d="M102.326 50.372v9.256a30.233 30.233 0 0 1-20.93-17.767h12.419c4.693.018 8.494 3.818 8.512 8.512z"/><linearGradient id="A" gradientUnits="userSpaceOnUse" x1="17.776" y1="35.199" x2="84.55" y2="150.848"><stop offset="0" stop-color="#5a62c3"/><stop offset=".5" stop-color="#4d55bd"/><stop offset="1" stop-color="#3940ab"/></linearGradient><path fill="url(#A)" d="M8.526 41.86H93.8a8.53 8.53 0 0 1 8.526 8.526v85.274a8.53 8.53 0 0 1-8.526 8.526H8.526A8.53 8.53 0 0 1 0 135.66V50.386a8.53 8.53 0 0 1 8.526-8.526z"/><path fill="#fff" d="M73.6 74.316H56.553v46.419h-10.86V74.316H28.726v-9.005H73.6z"/><defs><path id="B" d="M1192.167 561.355v111.442c-17.496-1.161-34.848-3.937-51.833-8.293a336.92 336.92 0 0 1-233.25-198.003h190.228c52.304.198 94.656 42.55 94.855 94.854z"/></defs></svg></span>',
  ms365:
    '<span class="atcb-icon-ms365"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 239.766"><path d="M200 219.785l-.021-.012V20.591L128.615 0 .322 48.172 0 48.234.016 192.257l43.78-17.134V57.943l84.819-20.279-.012 172.285L.088 192.257l128.515 47.456v.053l71.376-19.753v-.227z"/></svg></span>',
  outlookcom:
    '<span class="atcb-icon-outlookcom"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 175"><path d="M178.725 0H71.275A8.775 8.775 0 0 0 62.5 8.775v9.975l60.563 18.75L187.5 18.75V8.775A8.775 8.775 0 0 0 178.725 0z" fill="#0364b8"/><path d="M197.813 96.281c.915-2.878 2.187-5.855 2.187-8.781-.002-1.485-.795-2.857-1.491-3.26l-68.434-38.99a9.37 9.37 0 0 0-9.244-.519c-.312.154-.614.325-.906.512l-67.737 38.6-.025.013-.075.044a4.16 4.16 0 0 0-2.088 3.6c.541 2.971 1.272 5.904 2.188 8.781l71.825 52.532z" fill="#0a2767"/><path d="M150 18.75h-43.75L93.619 37.5l12.631 18.75L150 93.75h37.5v-37.5z" fill="#28a8ea"/><path d="M150 18.75h37.5v37.5H150z" fill="#50d9ff"/><path d="M150 93.75l-43.75-37.5H62.5v37.5l43.75 37.5 67.7 11.05z" fill="#0364b8"/><path d="M106.25 56.25v37.5H150v-37.5zM150 93.75v37.5h37.5v-37.5zm-87.5-75h43.75v37.5H62.5z" fill="#0078d4"/><path d="M62.5 93.75h43.75v37.5H62.5z" fill="#064a8c"/><path d="M126.188 145.113l-73.706-53.75 3.094-5.438 68.181 38.825a3.3 3.3 0 0 0 2.625-.075l68.331-38.937 3.1 5.431z" fill="#0a2767" opacity=".5"/><path d="M197.919 91.106l-.088.05-.019.013-67.738 38.588c-2.736 1.764-6.192 1.979-9.125.569l23.588 31.631 51.588 11.257v-.001c2.434-1.761 3.876-4.583 3.875-7.587V87.5c.001 1.488-.793 2.862-2.081 3.606z" fill="#1490df"/><path d="M200 165.625v-4.613l-62.394-35.55-7.531 4.294a9.356 9.356 0 0 1-9.125.569l23.588 31.631 51.588 11.231v.025a9.362 9.362 0 0 0 3.875-7.588z" opacity=".05"/><path d="M199.688 168.019l-68.394-38.956-1.219.688c-2.734 1.766-6.19 1.984-9.125.575l23.588 31.631 51.587 11.256v.001a9.38 9.38 0 0 0 3.562-5.187z" opacity=".1"/><path d="M51.455 90.721c-.733-.467-1.468-1.795-1.455-3.221v78.125c-.007 5.181 4.194 9.382 9.375 9.375h131.25c1.395-.015 2.614-.366 3.813-.813.638-.258 1.252-.652 1.687-.974z" fill="#28a8ea"/><path d="M112.5 141.669V39.581a8.356 8.356 0 0 0-8.331-8.331H62.687v46.6l-10.5 5.987-.031.012-.075.044A4.162 4.162 0 0 0 50 87.5v.031-.031V150h54.169a8.356 8.356 0 0 0 8.331-8.331z" opacity=".1"/><path d="M106.25 147.919V45.831a8.356 8.356 0 0 0-8.331-8.331H62.687v40.35l-10.5 5.987-.031.012-.075.044A4.162 4.162 0 0 0 50 87.5v.031-.031 68.75h47.919a8.356 8.356 0 0 0 8.331-8.331z" opacity=".2"/><path d="M106.25 135.419V45.831a8.356 8.356 0 0 0-8.331-8.331H62.687v40.35l-10.5 5.987-.031.012-.075.044A4.162 4.162 0 0 0 50 87.5v.031-.031 56.25h47.919a8.356 8.356 0 0 0 8.331-8.331z" opacity=".2"/><path d="M100 135.419V45.831a8.356 8.356 0 0 0-8.331-8.331H62.687v40.35l-10.5 5.987-.031.012-.075.044A4.162 4.162 0 0 0 50 87.5v.031-.031 56.25h41.669a8.356 8.356 0 0 0 8.331-8.331z" opacity=".2"/><path d="M8.331 37.5h83.337A8.331 8.331 0 0 1 100 45.831v83.338a8.331 8.331 0 0 1-8.331 8.331H8.331A8.331 8.331 0 0 1 0 129.169V45.831A8.331 8.331 0 0 1 8.331 37.5z" fill="#0078d4"/><path d="M24.169 71.675a26.131 26.131 0 0 1 10.263-11.337 31.031 31.031 0 0 1 16.313-4.087 28.856 28.856 0 0 1 15.081 3.875 25.875 25.875 0 0 1 9.988 10.831 34.981 34.981 0 0 1 3.5 15.938 36.881 36.881 0 0 1-3.606 16.662 26.494 26.494 0 0 1-10.281 11.213 30 30 0 0 1-15.656 3.981 29.556 29.556 0 0 1-15.425-3.919 26.275 26.275 0 0 1-10.112-10.85 34.119 34.119 0 0 1-3.544-15.744 37.844 37.844 0 0 1 3.481-16.563zm10.938 26.613a16.975 16.975 0 0 0 5.769 7.463 15.069 15.069 0 0 0 9.019 2.719 15.831 15.831 0 0 0 9.631-2.806 16.269 16.269 0 0 0 5.606-7.481 28.913 28.913 0 0 0 1.787-10.406 31.644 31.644 0 0 0-1.687-10.538 16.681 16.681 0 0 0-5.413-7.75 14.919 14.919 0 0 0-9.544-2.956 15.581 15.581 0 0 0-9.231 2.744 17.131 17.131 0 0 0-5.9 7.519 29.85 29.85 0 0 0-.044 21.5z" fill="#fff"/></svg></span>',
  yahoo:
    '<span class="atcb-icon-yahoo"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 177.803"><path d="M0 43.284h38.144l22.211 56.822 22.5-56.822h37.135L64.071 177.803H26.694l15.308-35.645L.001 43.284zm163.235 45.403H121.64L158.558 0 200 .002zm-30.699 8.488c12.762 0 23.108 10.346 23.108 23.106s-10.345 23.106-23.108 23.106a23.11 23.11 0 0 1-23.104-23.106 23.11 23.11 0 0 1 23.104-23.106z"/></svg></span>',
  atcb: '<svg version="1.1" viewBox="0 0 150 8.5002" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g transform="matrix(1.3333 0 0 -1.3333 -2427.5 1757.9)"><g transform="matrix(.22189 0 0 -.22189 1822.6 1374.6)" fill="#9a9a9a" style="paint-order:stroke markers fill;shape-inside:url(#rect2441);white-space:pre" aria-label="Add-to-Calendar-PRO.com"><path d="m-1.2773 253.99h12.148l7.9688 27.5h-9.4141l-1.0547-5.2734h-7.1094l-1.1328 5.2734h-9.0234zm8.7109 17.305-2.6172-12.031-2.6953 12.031z" style="paint-order:stroke markers fill"/><path d="m29.66 261.16q2.2656 0 3.9062 0.9375t2.6562 3.1055v-10.078l8.4375-1.25v27.617h-8.4375v-3.7109q-0.9375 2.0117-2.5586 3.0273-1.6211 0.9961-4.043 0.9961-2.0898 0-3.8672-0.83985-1.7773-0.85937-3.0859-2.2852-1.2891-1.4258-2.0312-3.2812-0.74219-1.875-0.74219-3.9062 0-2.1875 0.78125-4.082 0.80078-1.8945 2.1484-3.2812 1.3477-1.3867 3.1055-2.168 1.7773-0.80078 3.7305-0.80078zm6.5625 10.176q-0.03906-0.78125-0.37109-1.4844-0.33203-0.70312-0.87891-1.2109-0.52734-0.52735-1.2305-0.82032-0.70312-0.3125-1.4648-0.3125-0.85938 0-1.6016 0.33203-0.72266 0.3125-1.25 0.85938-0.52734 0.54687-0.83984 1.2695-0.29297 0.72266-0.29297 1.5234 0 0.85937 0.3125 1.582 0.33203 0.72266 0.87891 1.2695 0.54688 0.52734 1.2695 0.83984 0.72266 0.29297 1.5234 0.29297 0.83984 0 1.5625-0.33203 0.72266-0.33203 1.25-0.8789 0.52734-0.54688 0.82031-1.2695 0.3125-0.72265 0.3125-1.5039z" style="paint-order:stroke markers fill"/><path d="m57.551 261.16q2.2656 0 3.9062 0.9375t2.6562 3.1055v-10.078l8.4375-1.25v27.617h-8.4375v-3.7109q-0.9375 2.0117-2.5586 3.0273-1.6211 0.9961-4.043 0.9961-2.0898 0-3.8672-0.83985-1.7773-0.85937-3.0859-2.2852-1.2891-1.4258-2.0312-3.2812-0.74219-1.875-0.74219-3.9062 0-2.1875 0.78125-4.082 0.80078-1.8945 2.1484-3.2812 1.3477-1.3867 3.1055-2.168 1.7773-0.80078 3.7305-0.80078zm6.5625 10.176q-0.03906-0.78125-0.37109-1.4844-0.33203-0.70312-0.87891-1.2109-0.52734-0.52735-1.2305-0.82032-0.70312-0.3125-1.4648-0.3125-0.85938 0-1.6016 0.33203-0.72266 0.3125-1.25 0.85938-0.52734 0.54687-0.83984 1.2695-0.29297 0.72266-0.29297 1.5234 0 0.85937 0.3125 1.582 0.33203 0.72266 0.87891 1.2695 0.54688 0.52734 1.2695 0.83984 0.72266 0.29297 1.5234 0.29297 0.83984 0 1.5625-0.33203 0.72266-0.33203 1.25-0.8789 0.52734-0.54688 0.82031-1.2695 0.3125-0.72265 0.3125-1.5039z" style="paint-order:stroke markers fill"/><path d="m76.496 268.8h10.742v4.7266h-10.742z" style="paint-order:stroke markers fill"/><path d="m104.8 280.44q-2.7148 1.3672-6.0156 1.3672-1.6992 0-3.0273-0.54688-1.3281-0.5664-2.2461-1.6016-0.89844-1.0547-1.3672-2.5195-0.46875-1.4844-0.46875-3.3398l0.03906-7.3828h-2.5391v-4.9609h3.1641l3.7109-7.5781h4.0625v7.5781h4.6094v4.9609h-4.6094v6.7969q0 1.0547 0.68359 1.582t1.8555 0.52734q0.91797 0 1.8359-0.46875z" style="paint-order:stroke markers fill"/><path d="m114.62 271.45q0 1.0938 0.3125 1.9141 0.33204 0.82031 0.85938 1.3672 0.52734 0.54687 1.2109 0.82031 0.68359 0.27344 1.3867 0.27344 0.70312 0 1.3672-0.27344 0.6836-0.27344 1.2109-0.82031 0.54688-0.54688 0.85938-1.3672 0.33203-0.82031 0.33203-1.9141t-0.33203-1.9141q-0.3125-0.82031-0.85938-1.3476-0.52734-0.54688-1.2109-0.82032-0.66406-0.27343-1.3672-0.27343-0.70313 0-1.3867 0.27343-0.6836 0.27344-1.2109 0.82032-0.52734 0.52734-0.85938 1.3476-0.3125 0.82032-0.3125 1.9141zm-7.8125 0q0.0977-2.5195 1.0352-4.4336 0.95703-1.9141 2.5195-3.2226 1.5625-1.3086 3.6133-1.9727 2.0703-0.66406 4.3945-0.66406 2.5391 0 4.6484 0.76172 2.1094 0.76171 3.6328 2.1289 1.5234 1.3477 2.3633 3.2422 0.83985 1.8945 0.83985 4.1602 0 1.8359-0.48828 3.3203-0.46875 1.4844-1.2891 2.6367-0.82031 1.1328-1.9336 1.9726-1.1133 0.83985-2.4023 1.3867-1.2891 0.52735-2.6758 0.78125-1.3672 0.25391-2.7344 0.25391-2.5781 0-4.707-0.74219-2.1094-0.76172-3.6328-2.1289-1.5234-1.3672-2.3633-3.2617-0.82032-1.9141-0.82032-4.2188z" style="paint-order:stroke markers fill"/><path d="m132.73 268.8h10.742v4.7266h-10.742z" style="paint-order:stroke markers fill"/><path d="m162.41 274.89q0.6836 0 1.2695-0.0586 0.58594-0.0781 1.1524-0.21484 0.58593-0.13672 1.1914-0.35156 0.60547-0.21485 1.3477-0.50782l1.0938 6.3477q-3.4766 2.0117-7.5781 2.0117-5.8008 0-9.9414-3.9062-4.3359-4.0625-4.3945-10.488 0-3.125 1.0742-5.7617 1.0742-2.6367 2.9688-4.5312 1.8945-1.9141 4.4726-2.9688 2.5781-1.0742 5.5859-1.0742 4.2773 0 7.7734 1.9922l-1.0547 6.2109q-2.8711-1.0938-5.1953-1.0938-3.2617 0-4.9609 1.8945-1.6797 1.875-1.6797 5.293 0 1.6992 0.44922 3.0469 0.46875 1.3281 1.3477 2.2656 0.8789 0.91797 2.1484 1.4062 1.2891 0.48829 2.9297 0.48829z" style="paint-order:stroke markers fill"/><path d="m186.52 277.78q-0.9375 1.9531-2.5391 2.9883-1.6016 1.0352-4.0234 1.0352-1.9531 0-3.7305-0.78125-1.7774-0.80078-3.125-2.1875-1.3477-1.4062-2.1484-3.3203-0.80078-1.9141-0.80078-4.1602 0-2.2266 0.80078-4.1016 0.82031-1.875 2.168-3.2227 1.3672-1.3672 3.125-2.1094 1.7773-0.76172 3.7109-0.76172 0.9961 0 1.9531 0.27343 0.97656 0.25391 1.8359 0.83985 0.8789 0.5664 1.582 1.4453 0.72265 0.87891 1.1914 2.1094v-4.668h8.3984v20.332h-8.3984zm0-6.4453q-0.0391-0.78125-0.37109-1.4844-0.33203-0.70312-0.87891-1.2109-0.52734-0.52735-1.2305-0.82032-0.70313-0.3125-1.4648-0.3125-0.85937 0-1.6016 0.33203-0.72266 0.3125-1.2695 0.85938-0.52735 0.52734-0.83985 1.25t-0.3125 1.543q0 0.85937 0.33204 1.6016 0.33203 0.72266 0.8789 1.25 0.56641 0.52734 1.2891 0.83984 0.72266 0.29297 1.5234 0.29297 0.82031 0 1.5234-0.3125 0.70312-0.3125 1.2305-0.83984 0.52734-0.52734 0.83984-1.2109 0.3125-0.70312 0.35156-1.4648z" style="paint-order:stroke markers fill"/><path d="m212.02 280.44q-2.7148 1.3672-6.0156 1.3672-1.6992 0-3.0273-0.54688-1.3281-0.5664-2.2461-1.6016-0.89843-1.0547-1.3672-2.5195-0.46875-1.4844-0.46875-3.3398v-18.672l8.4375-1.25v19.336q0 1.0742 0.68359 1.6016 0.68359 0.50781 1.8555 0.50781 0.89844 0 1.8359-0.46875z" style="paint-order:stroke markers fill"/><path d="m225.71 276.2q2.7344 0 5.8984-1.4062l0.97656 5.3711q-3.6328 1.6406-8.1641 1.6406-2.5195 0-4.6094-0.76172-2.0703-0.78125-3.5742-2.1484-1.4844-1.3867-2.3242-3.2812-0.82031-1.8945-0.82031-4.1211 0-2.3438 0.85937-4.2383 0.87891-1.9141 2.3828-3.2617 1.5039-1.3672 3.5156-2.0898 2.0117-0.74218 4.2969-0.74218 2.3047 0 4.043 0.78125 1.7383 0.76172 2.8906 2.1094 1.1719 1.3281 1.7383 3.125 0.58594 1.7774 0.58594 3.8086 0 0.27343-0.0195 0.52734t-0.0586 0.48828l-11.992 1.5625q0.46875 1.4062 1.5625 2.0312 1.0938 0.60547 2.8125 0.60547zm1.4844-7.6758q-0.6836-2.5-3.0469-2.5-0.74218 0-1.3281 0.29297t-0.9961 0.82031q-0.39062 0.50781-0.60546 1.2305-0.21485 0.70312-0.23438 1.5234z" style="paint-order:stroke markers fill"/><path d="m236.3 261.75h8.0469v4.082q1.1719-2.3633 3.0078-3.5156 1.8555-1.1523 4.3359-1.1523 1.9922 0 3.5156 0.74218 1.5234 0.74219 2.5586 2.1094 1.0547 1.3477 1.582 3.2617 0.54687 1.8945 0.54687 4.2188v10h-8.3984v-10.82q0-0.78125-0.15625-1.4453-0.13672-0.66406-0.46875-1.1328-0.3125-0.48828-0.80078-0.74219-0.48828-0.27343-1.1914-0.27343-0.85938 0-1.582 0.42968-0.72265 0.41016-1.2695 1.0156-0.52734 0.60547-0.85937 1.2695-0.33203 0.64453-0.42969 1.1133v10.586h-8.4375z" style="paint-order:stroke markers fill"/><path d="m272.59 261.16q2.2656 0 3.9062 0.9375 1.6406 0.9375 2.6562 3.1055v-10.078l8.4375-1.25v27.617h-8.4375v-3.7109q-0.9375 2.0117-2.5586 3.0273-1.6211 0.9961-4.043 0.9961-2.0898 0-3.8672-0.83985-1.7773-0.85937-3.0859-2.2852-1.2891-1.4258-2.0312-3.2812-0.74219-1.875-0.74219-3.9062 0-2.1875 0.78125-4.082 0.80078-1.8945 2.1484-3.2812 1.3476-1.3867 3.1055-2.168 1.7774-0.80078 3.7305-0.80078zm6.5625 10.176q-0.0391-0.78125-0.37109-1.4844-0.33203-0.70312-0.87891-1.2109-0.52734-0.52735-1.2305-0.82032-0.70312-0.3125-1.4648-0.3125-0.85937 0-1.6016 0.33203-0.72266 0.3125-1.25 0.85938-0.52735 0.54687-0.83985 1.2695-0.29296 0.72266-0.29296 1.5234 0 0.85937 0.3125 1.582 0.33203 0.72266 0.8789 1.2695 0.54688 0.52734 1.2695 0.83984 0.72266 0.29297 1.5234 0.29297 0.83984 0 1.5625-0.33203t1.25-0.8789q0.52734-0.54688 0.82031-1.2695 0.3125-0.72265 0.3125-1.5039z" style="paint-order:stroke markers fill"/><path d="m307.06 277.78q-0.9375 1.9531-2.5391 2.9883-1.6016 1.0352-4.0234 1.0352-1.9531 0-3.7305-0.78125-1.7773-0.80078-3.125-2.1875-1.3477-1.4062-2.1484-3.3203-0.80078-1.9141-0.80078-4.1602 0-2.2266 0.80078-4.1016 0.82032-1.875 2.168-3.2227 1.3672-1.3672 3.125-2.1094 1.7774-0.76172 3.7109-0.76172 0.99609 0 1.9531 0.27343 0.97657 0.25391 1.8359 0.83985 0.87891 0.5664 1.582 1.4453 0.72266 0.87891 1.1914 2.1094v-4.668h8.3984v20.332h-8.3984zm0-6.4453q-0.0391-0.78125-0.37109-1.4844-0.33204-0.70312-0.87891-1.2109-0.52734-0.52735-1.2305-0.82032-0.70312-0.3125-1.4648-0.3125-0.85938 0-1.6016 0.33203-0.72265 0.3125-1.2695 0.85938-0.52734 0.52734-0.83984 1.25t-0.3125 1.543q0 0.85937 0.33203 1.6016 0.33203 0.72266 0.87891 1.25 0.5664 0.52734 1.2891 0.83984 0.72266 0.29297 1.5234 0.29297 0.82031 0 1.5234-0.3125 0.70313-0.3125 1.2305-0.83984 0.52735-0.52734 0.83985-1.2109 0.3125-0.70312 0.35156-1.4648z" style="paint-order:stroke markers fill"/><path d="m319.5 261.75h8.4375v4.082q0.95703-2.4219 2.5391-3.5352 1.6016-1.1328 3.6719-1.1328l1.1719 6.543q-3.8086 0-5.6055 0.82031-1.7773 0.80078-1.7773 2.5781v10.391h-8.4375z" style="paint-order:stroke markers fill"/><path d="m337.22 268.8h10.742v4.7266h-10.742z" style="paint-order:stroke markers fill"/><path d="m352.43 253.99h9.9219q3.0859 0 5.4883 0.60547t4.043 1.7773q1.6406 1.1719 2.5 2.8711 0.85937 1.6797 0.85937 3.8477 0 2.1094-0.97656 3.7695-0.97656 1.6602-2.6758 2.832-1.6992 1.1524-3.9844 1.7774-2.2656 0.60547-4.8633 0.60547h-1.6797v9.4141h-8.6328zm10.352 12.539q2.0703 0 3.2422-0.85937 1.1719-0.85938 1.1719-2.5781 0-0.83984-0.35156-1.4648-0.33204-0.625-0.9375-1.0352-0.58594-0.42969-1.3867-0.64453t-1.7383-0.21484h-1.7188v6.7188q0.27343 0.0391 0.70312 0.0586t1.0156 0.0195z" style="paint-order:stroke markers fill"/><path d="m402.92 281.41q-2.5586 0.70313-3.6914 0.70313-7.2461 0-9.1016-6.6016l-1.0938-4.4531h-1.875v10.43h-8.75v-27.5h12.227q2.3828 0 4.4726 0.54687 2.0898 0.52735 3.6328 1.5625 1.5625 1.0156 2.4414 2.5195 0.89844 1.5039 0.89844 3.457 0 1.4453-0.37109 2.5976-0.35157 1.1328-1.0352 2.0508-0.68359 0.89844-1.6797 1.6016-0.97656 0.70312-2.2266 1.25l0.17578 0.95703q0.0586 0.33203 0.11719 0.5664 0.0586 0.23438 0.0977 0.39063l0.21484 0.83984q0.23437 0.74219 0.52734 1.2695 0.3125 0.50782 0.78125 0.83985 0.46875 0.3125 1.1524 0.46875 0.70312 0.13672 1.6992 0.13672 0.15625 0 0.48828-0.0391 0.35156-0.0391 0.89843-0.11718zm-8.8476-18.945q0-0.76172-0.33203-1.25-0.3125-0.50781-0.87891-0.78125-0.56641-0.29297-1.3281-0.39062-0.76172-0.11719-1.6406-0.11719h-2.7344v5.5078h1.5234l1.2891-0.0586q0.76171-0.0586 1.4844-0.19532 0.74219-0.15625 1.3281-0.46875 0.58593-0.33203 0.9375-0.85937 0.35156-0.54688 0.35156-1.3867z" style="paint-order:stroke markers fill"/><path d="m404.76 267.78q0-5.957 3.7891-10.039 4.043-4.3555 10.938-4.3555 3.3594 0 6.0742 1.0938 2.7148 1.0742 4.6289 2.9883t2.9492 4.5703q1.0352 2.6367 1.0352 5.7422 0 1.875-0.42968 3.6719-0.42969 1.7969-1.2891 3.3984-0.83984 1.582-2.0898 2.9297-1.25 1.3281-2.8906 2.3047-1.6211 0.95703-3.6328 1.4844-1.9922 0.54688-4.3555 0.54688-2.4219 0-4.4531-0.54688-2.0117-0.54687-3.6523-1.5234-1.6406-0.97657-2.8906-2.3242-1.2305-1.3477-2.0703-2.9297-0.82031-1.6016-1.25-3.3789-0.41016-1.7773-0.41016-3.6328zm14.727 7.0703q1.543 0 2.6172-0.64453 1.0938-0.66406 1.7774-1.6797 0.70312-1.0352 1.0156-2.3047 0.33203-1.2695 0.33203-2.4805 0-1.582-0.41015-2.8906-0.39063-1.3281-1.1524-2.2852-0.74219-0.97657-1.8164-1.543-1.0547-0.56641-2.3633-0.625-1.5625 0.0391-2.6562 0.70312-1.0938 0.66407-1.7969 1.7188-0.68359 1.0352-1.0156 2.3438-0.3125 1.2891-0.3125 2.5781 0 1.5234 0.39063 2.832 0.41016 1.2891 1.1523 2.2461 0.76172 0.9375 1.8359 1.4844 1.0742 0.54687 2.4023 0.54687z" style="paint-order:stroke markers fill"/><path d="m436.18 279.2q0-0.58594 0.2474-1.0807 0.26042-0.49479 0.67708-0.84636 0.41667-0.35156 0.95053-0.54687 0.54687-0.20834 1.1198-0.20834 0.59896 0 1.1458 0.22136 0.54688 0.20833 0.95053 0.58594 0.41666 0.36458 0.65104 0.84635 0.2474 0.48177 0.2474 1.0286 0 0.61198-0.26042 1.1068-0.2474 0.49479-0.66407 0.85938-0.41666 0.35156-0.96354 0.54687-0.53385 0.19531-1.1068 0.19531-0.625 0-1.1719-0.20833-0.54687-0.20833-0.95052-0.57292-0.40365-0.36458-0.63802-0.85937-0.23438-0.49479-0.23438-1.0677z" style="paint-order:stroke markers fill"/><path d="m454.38 272.56q-1.4062-0.4427-2.6042-0.4427-0.61198 0-1.1068 0.19531-0.48177 0.19531-0.83333 0.54687-0.33855 0.35157-0.53386 0.85938-0.18229 0.49479-0.18229 1.1068t0.18229 1.1198q0.19531 0.49479 0.54688 0.85937 0.35156 0.36459 0.84635 0.5599 0.50782 0.19531 1.1328 0.19531 1.1849 0 2.5-0.44271l0.52083 3.724q-1.0026 0.52083-1.9661 0.6901-0.95053 0.16927-2.0703 0.16927-1.5755 0-2.9036-0.49479t-2.2917-1.3932-1.5104-2.1615q-0.53385-1.276-0.53385-2.8255t0.58594-2.8125q0.58593-1.276 1.5755-2.1745 1.0026-0.91146 2.3177-1.4062 1.3151-0.4948 2.7604-0.4948 0.63802 0 1.1458 0.0521 0.52084 0.0391 0.98959 0.16927 0.46875 0.11718 0.9375 0.32552 0.46875 0.20833 1.0156 0.53385z" style="paint-order:stroke markers fill"/><path d="m461.18 274.8q0 0.72917 0.20833 1.276 0.22136 0.54688 0.57292 0.91146 0.35157 0.36459 0.80729 0.54688 0.45573 0.18229 0.92449 0.18229 0.46875 0 0.91145-0.18229 0.45573-0.18229 0.8073-0.54688 0.36458-0.36458 0.57291-0.91146 0.22136-0.54687 0.22136-1.276t-0.22136-1.276q-0.20833-0.54688-0.57291-0.89844-0.35157-0.36458-0.8073-0.54688-0.4427-0.18229-0.91145-0.18229-0.46876 0-0.92449 0.18229-0.45572 0.1823-0.80729 0.54688-0.35156 0.35156-0.57292 0.89844-0.20833 0.54687-0.20833 1.276zm-5.2083 0q0.0651-1.6797 0.69011-2.9557 0.63802-1.276 1.6797-2.1484 1.0417-0.8724 2.4088-1.3151 1.3802-0.44271 2.9297-0.44271 1.6927 0 3.099 0.50782 1.4062 0.50781 2.4219 1.4193 1.0156 0.89844 1.5755 2.1615 0.55989 1.263 0.55989 2.7734 0 1.224-0.32552 2.2136-0.3125 0.98958-0.85937 1.7578-0.54688 0.75521-1.2891 1.3151-0.74219 0.55989-1.6016 0.92448-0.85938 0.35156-1.7839 0.52083-0.91146 0.16927-1.8229 0.16927-1.7188 0-3.138-0.49479-1.4062-0.50781-2.4219-1.4193t-1.5755-2.1745q-0.54688-1.276-0.54688-2.8125z" style="paint-order:stroke markers fill"/><path d="m488.16 271.26q0.54688-1.6536 1.7578-2.487 1.2109-0.83334 3.138-0.83334 1.0938 0 2.0182 0.50782 0.92448 0.50781 1.6016 1.4193 0.67708 0.91146 1.0547 2.1745 0.3776 1.263 0.3776 2.7865v6.6667h-5.625v-6.6667q0-0.55989-0.13021-1.0286-0.11718-0.48178-0.35156-0.83334-0.23437-0.35156-0.57292-0.54687-0.33854-0.19532-0.76823-0.19532-0.55989 0-0.96354 0.26042-0.40364 0.2474-0.66406 0.63802-0.26042 0.37761-0.39063 0.84636-0.11718 0.45573-0.11718 0.85937v6.6667h-5.5729v-6.6667q0-0.54687-0.13021-1.0156-0.11718-0.48178-0.36458-0.83334-0.23438-0.35156-0.58594-0.54687-0.35156-0.20834-0.79427-0.20834-0.48177 0-0.8724 0.19532-0.3776 0.19531-0.65104 0.54687-0.27344 0.33854-0.42969 0.79427-0.14323 0.45573-0.15625 0.96355v6.7708h-5.625v-13.164h5.625v2.7214q0.74219-1.6536 1.875-2.3828 1.1458-0.72917 2.6823-0.72917 0.74219 0 1.4323 0.19532 0.69011 0.18229 1.2891 0.58593 0.61198 0.40365 1.0938 1.0417 0.49479 0.625 0.82031 1.4974z" style="paint-order:stroke markers fill"/></g></g></svg>',
  close:
    '<span class="atcb-icon-close"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><path d="M2.321 13.529a7.927 7.927 0 0 1 0-11.208 7.927 7.927 0 0 1 11.208 0l86.471 86.471L186.47 2.321a7.927 7.927 0 0 1 11.209 0 7.927 7.927 0 0 1 0 11.208l-86.474 86.469 86.472 86.473a7.927 7.927 0 0 1-11.209 11.208l-86.471-86.471-86.469 86.471a7.927 7.927 0 0 1-11.208-11.208l86.471-86.473z"/></svg></span>',
  location:
    '<span class="atcb-icon-location"><svg viewBox="0 0 200 266.42" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="m148.54 230.43c-12.12 13.291-26.234 25.193-42.083 34.82-1.9513 1.431-4.5964 1.6044-6.7645 0.21681-23.416-14.895-43.08-32.782-58.539-52.23-21.334-26.755-34.755-56.414-39.351-84.99-4.6831-28.966-0.30354-56.848 14.114-79.505 5.6805-8.9543 12.944-17.106 21.79-24.153 20.337-16.196 43.557-24.76 66.713-24.586 22.288 0.17345 44.295 8.4773 63.309 25.844 6.6778 6.0707 12.293 13.03 16.89 20.575 15.502 25.54 18.841 58.105 12.033 91.104-6.7212 32.608-23.416 65.737-48.11 92.839zm-48.544-178.91c27.492 0 49.758 22.288 49.758 49.758 0 27.492-22.288 49.758-49.758 49.758-27.492 0-49.758-22.267-49.758-49.758-0.02168-27.492 22.267-49.758 49.758-49.758z" stroke-width="2.1681"/></svg></span>',
  warning:
    '<span class="atcb-icon-warning"><svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><path d="m100 0c27.613 0 52.613 11.195 70.711 29.293 18.094 18.094 29.289 43.098 29.289 70.707 0 27.613-11.195 52.613-29.289 70.711-18.098 18.094-43.098 29.289-70.711 29.289-27.609 0-52.613-11.195-70.707-29.289-18.098-18.098-29.293-43.098-29.293-70.711 0-27.609 11.195-52.613 29.293-70.707 18.094-18.098 43.098-29.293 70.707-29.293zm57.66 42.34c-14.758-14.754-35.145-23.883-57.66-23.883-22.516 0-42.902 9.1289-57.66 23.883-14.754 14.758-23.883 35.145-23.883 57.66 0 22.516 9.1289 42.902 23.883 57.66 14.758 14.754 35.145 23.883 57.66 23.883 22.516 0 42.902-9.1289 57.66-23.883 14.754-14.758 23.883-35.145 23.883-57.66 0-22.516-9.1289-42.902-23.883-57.66z" fill="#f44336" fill-rule="nonzero" stroke-width=".39062"/><g transform="matrix(3.8384 0 0 3.8384 2277.8 -576.85)" style="shape-inside:url(#rect7396);white-space:pre" aria-label="!"><path d="m-563.8 161.59-0.65341 20.185h-5.8381l-0.65341-20.185zm-3.5796 29.503q-1.5199 0-2.6136-1.0795-1.0796-1.0796-1.0796-2.6136 0-1.5057 1.0796-2.571 1.0938-1.0796 2.6136-1.0796 1.4631 0 2.571 1.0796 1.1222 1.0653 1.1222 2.571 0 1.0227-0.52557 1.8608-0.51137 0.83807-1.3494 1.3352-0.82387 0.49715-1.8182 0.49715z"/></g></svg></span>',
  checkmark:
    '<span class="atcb-icon-checkmark"><svg viewBox="0 0 122.88 122.87" xmlns="http://www.w3.org/2000/svg"><path fill:#39B54A; d="m33.666 50.046s6.0748-0.59297 17.413 4.2983c9.3883 4.5751 11.891 8.3955 11.891 8.3955 5.38-8.65 11.11-16.6 17.16-23.9 10.412-12.578 24.613-22.448 24.613-22.448l14.257-0.012228s-19.308 19.294-32.483 38.51c-13.175 19.216-22.877 41.21-22.877 41.21s-9.3948-18.164-14.53-24.53-10.77-11.59-17.52-16.22z" fill="#45b555"/><path fill:#3C3C3C; d="m61.44 0c9.53 0 18.55 2.17 26.61 6.04-3.3 2.61-6.36 5.11-9.21 7.53-5.43-1.97-11.28-3.05-17.39-3.05-14.06 0-26.79 5.7-36 14.92s-14.92 21.94-14.92 36 5.7 26.78 14.92 36 21.94 14.92 36 14.92 26.79-5.7 36-14.92c9.22-9.22 14.91-21.94 14.91-36 0-3.34-0.32-6.62-0.94-9.78 2.64-3.44 5.35-6.88 8.11-10.28 2.17 6.28 3.35 13.04 3.35 20.06 0 16.96-6.88 32.33-17.99 43.44-11.12 11.12-26.48 18-43.44 18s-32.32-6.88-43.44-18c-11.13-11.12-18.01-26.48-18.01-43.44 0-16.97 6.88-32.33 17.99-43.44 11.12-11.12 26.48-18 43.45-18z"/></svg></span>',
};

export {
  atcbVersion,
  isBrowser,
  isiOS,
  isAndroid,
  isChrome,
  isMobile,
  isWebView,
  isProblematicWebView,
  atcbDefaultTarget,
  atcbOptions,
  atcbValidRecurrOptions,
  atcbInvalidSubscribeOptions,
  atcbiOSInvalidOptions,
  atcbStates,
  atcbIcon,
};
