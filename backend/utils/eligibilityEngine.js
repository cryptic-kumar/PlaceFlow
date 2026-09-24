const { BANDS, PLACEMENT_STATUS, OFFER_STATUS } = require('./constants');

function classifyCTC(ctc, thresholds) {
  const { normalMax, dreamMax } = thresholds;
  if (ctc < normalMax) return BANDS.NORMAL;
  if (ctc <= dreamMax) return BANDS.DREAM;
  return BANDS.SUPER_DREAM;
}

function checkEligibility(student, drive, policy) {
  const band = drive.band;

  if (student.placementStatus === PLACEMENT_STATUS.AEDP_SELECTED) {
    return {
      eligible: false,
      band,
      reason:
        'You are no longer active in the placement season because of an AEDP selection.',
    };
  }

  const categoryBandMap = policy.categoryBandMap instanceof Map
    ? policy.categoryBandMap
    : new Map(Object.entries(policy.categoryBandMap || {}));
  const allowedBands = categoryBandMap.get(student.category) || [];

  if (!allowedBands.includes(band)) {
    return {
      eligible: false,
      band,
      reason: `${student.category} students cannot apply for ${bandLabel(band)} opportunities.`,
    };
  }

  if (policy.oneOfferPerBand) {
    const alreadyAcceptedInBand = (student.offers || []).some(
      (offer) => offer.band === band && offer.status === OFFER_STATUS.ACCEPTED
    );
    if (alreadyAcceptedInBand) {
      return {
        eligible: false,
        band,
        reason: `You already have an accepted ${bandLabel(band)} offer. Only one offer is allowed per band.`,
      };
    }
  }

  if (drive.deadline && new Date(drive.deadline).getTime() < Date.now()) {
    return {
      eligible: false,
      band,
      reason: 'The application deadline for this drive has passed.',
    };
  }

  if (!drive.published) {
    return {
      eligible: false,
      band,
      reason: 'This drive has not been published yet.',
    };
  }

  return { eligible: true, band, reason: 'You meet all eligibility criteria for this drive.' };
}

function bandLabel(band) {
  switch (band) {
    case BANDS.NORMAL:
      return 'Normal (< 5 LPA)';
    case BANDS.DREAM:
      return 'Dream (5-10 LPA)';
    case BANDS.SUPER_DREAM:
      return 'Super Dream (> 10 LPA)';
    default:
      return band;
  }
}

module.exports = { classifyCTC, checkEligibility, bandLabel };
