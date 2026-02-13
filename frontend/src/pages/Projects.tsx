import { PageContainer, SectionHeader, Card, CardContent } from '../components/ui';

const Projects = () => {
  return (
    <PageContainer>
      <SectionHeader
        title="Projects"
        subtitle="Showcase your student projects"
      />
      <Card glass>
        <CardContent>
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-neutral-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Coming in Phase 3</h3>
            <p className="text-neutral-400 max-w-md mx-auto">
              The project showcase platform will allow students to submit and display their work to the campus community.
            </p>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
};

export default Projects;
