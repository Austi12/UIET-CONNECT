import { PageContainer, SectionHeader, Card, CardContent } from '../components/ui';

const LostFound = () => {
  return (
    <PageContainer>
      <SectionHeader
        title="Lost & Found"
        subtitle="AI-powered image matching system"
      />
      <Card glass>
        <CardContent>
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-neutral-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Coming in Phase 2</h3>
            <p className="text-neutral-400 max-w-md mx-auto">
              The AI-powered Lost & Found system with image matching will be available in the next phase of development.
            </p>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
};

export default LostFound;
