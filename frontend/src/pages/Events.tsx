import { PageContainer, SectionHeader, Card, CardContent } from '../components/ui';

const Events = () => {
  return (
    <PageContainer>
      <SectionHeader
        title="Events"
        subtitle="Register for campus events and activities"
      />
      <Card glass>
        <CardContent>
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-neutral-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Coming in Phase 3</h3>
            <p className="text-neutral-400 max-w-md mx-auto">
              Event management and registration features will be available to help you stay connected with campus activities.
            </p>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
};

export default Events;
