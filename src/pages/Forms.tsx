import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card';
import { DocumentArrowDownIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { CustomButton } from '../components/CustomButton';

export function Forms() {
  const { t } = useTranslation();

  const handleDownloadP87 = () => {
    window.open('https://assets.publishing.service.gov.uk/media/65c3605a3f634b000d42c5f3/P87_fillable_English_baselined.pdf', '_blank');
  };

  const handleOnlineP87 = () => {
    window.open('https://www.gov.uk/guidance/claim-income-tax-relief-for-your-employment-expenses-p87#claim-online', '_blank');
  };

  // Get the translated arrays with proper typing
  const eligibleItems = t('forms.p87.eligibleItems', { returnObjects: true }) as string[];
  const ineligibleItems = t('forms.p87.ineligibleItems', { returnObjects: true }) as string[];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('forms.title')}</CardTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('forms.description')}</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* P87 Form */}
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {t('forms.p87.title')}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {t('forms.p87.description')}
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {t('forms.p87.details')}
              </p>

              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('forms.p87.eligible')}
                </h3>
                <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  {eligibleItems.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('forms.p87.ineligible')}
                </h3>
                <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  {ineligibleItems.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <CustomButton
                  onClick={handleOnlineP87}
                  icon={<ArrowTopRightOnSquareIcon className="h-5 w-5" />}
                >
                  {t('forms.p87.buttonText')}
                </CustomButton>
                <CustomButton
                  variant="secondary"
                  onClick={handleDownloadP87}
                  icon={<DocumentArrowDownIcon className="h-5 w-5" />}
                >
                  {t('forms.p87.downloadText')}
                </CustomButton>
              </div>
            </div>

            {/* P60 Information */}
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {t('forms.p60.title')}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                {t('forms.p60.description')}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('forms.p60.details')}
              </p>
            </div>

            {/* P45 Information */}
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {t('forms.p45.title')}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                {t('forms.p45.description')}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('forms.p45.details')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}