import crownLogo from '../assets/hmrc-crown.svg';

export function CrownLogo() {
  return (
    <img
      src={crownLogo}
      alt="HM Revenue & Customs"
      width="48"
      height="48"
      className="h-12 w-12 hmrc-crown-logo"
    />
  );
}
