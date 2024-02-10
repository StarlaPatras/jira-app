// Component
import ProjectItem from "./ProjectItem";

interface Project {
  projectName: string;
  description: string;
  _id: string;
  creator: string;
}

interface ProjectListProps {
  items: Project[];
  onDeleteProject: (id: string) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({
  items,
  onDeleteProject,
}) => {
  if (items.length === 0) {
    return (
      <div className="mt-8 text-center">
        <p className="text-xl font-semibold text-gray-700 ">
          No Projects found
        </p>
      </div>
    );
  }

  return (
    <>
      <h1 className="mb-8 text-2xl font-bold text-gray-600 uppercase ">
        your workspaces
      </h1>

      <div className="grid grid-cols-3 gap-6">
        {items.map((p, i) => (
          <ProjectItem
            key={p._id}
            projectName={p.projectName}
            description={p.description}
            id={p._id}
            onDelete={onDeleteProject}
            creator={p.creator}
          />
        ))}
      </div>
    </>
  );
};

export default ProjectList;
