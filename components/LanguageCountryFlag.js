import React from "react";
import ReactCountryFlag from "react-country-flag";

const LanguageCountryFlag = React.memo(function LanguageCountryFlag({
  locale,
}) {
  const languageFlag = () => {
    switch (locale) {
      case "en":
        return (
          <>
            <ReactCountryFlag countryCode="US" svg /> English
          </>
        );
      case "fr":
        return (
          <>
            <ReactCountryFlag countryCode="FR" svg /> French
          </>
        );

      case "id":
        return (
          <>
            <ReactCountryFlag countryCode="ID" svg /> Indonesian
          </>
        );
      case "ms":
        return (
          <>
            <ReactCountryFlag countryCode="MS" svg /> Malay
          </>
        );
      case "da":
        return (
          <>
            <ReactCountryFlag countryCode="DK" svg /> Danish
          </>
        );
      case "de":
        return (
          <>
            <ReactCountryFlag countryCode="DE" svg /> German
          </>
        );
      case "es":
        return (
          <>
            <ReactCountryFlag countryCode="ES" svg /> Spanish
          </>
        );
      case "it":
        return (
          <>
            <ReactCountryFlag countryCode="IT" svg /> Italian
          </>
        );
      case "nl":
        return (
          <>
            <ReactCountryFlag countryCode="NL" svg /> Dutch
          </>
        );
      case "pl":
        return (
          <>
            <ReactCountryFlag countryCode="PL" svg /> Polish
          </>
        );
      case "pt":
        return (
          <>
            <ReactCountryFlag countryCode="PT" svg /> Portuguese
          </>
        );
      case "sv":
        return (
          <>
            <ReactCountryFlag countryCode="SV" svg /> Swedish
          </>
        );
      case "vi":
        return (
          <>
            <ReactCountryFlag countryCode="VI" svg /> Vietnamese
          </>
        );
      case "tr":
        return (
          <>
            <ReactCountryFlag countryCode="TR" svg /> Turkish
          </>
        );
      case "ru":
        return (
          <>
            <ReactCountryFlag countryCode="RU" svg /> Russian
          </>
        );
      case "uk":
        return (
          <>
            <ReactCountryFlag countryCode="UA" svg /> Ukrainian
          </>
        );
      case "ar":
        return (
          <>
            <ReactCountryFlag countryCode="SA" svg /> Arabic
          </>
        );
      case "hi":
        return (
          <>
            <ReactCountryFlag countryCode="IN" svg /> Hindi
          </>
        );
      case "ko":
        return (
          <>
            <ReactCountryFlag countryCode="KR" svg /> Korean
          </>
        );
      case "zh":
        return (
          <>
            <ReactCountryFlag countryCode="CN" svg /> Chinese
          </>
        );
      case "th":
        return (
          <>
            <ReactCountryFlag countryCode="TH" svg /> Thai
          </>
        );
      case "ja":
        return (
          <>
            <ReactCountryFlag countryCode="JP" svg /> Japanese
          </>
        );
      default:
        return (
          <>
            <ReactCountryFlag countryCode="US" svg /> English
          </>
        );
    }
  };
  return languageFlag();
});
export default LanguageCountryFlag;
