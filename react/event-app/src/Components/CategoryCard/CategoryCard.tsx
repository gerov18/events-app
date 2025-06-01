type CategoryCardProps = {
  name: string;
  onClick?: () => void;
};

const CategoryCard: React.FC<CategoryCardProps> = ({
  name,

  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className='
        max-w-xs h-40
        bg-gradient-to-br from-gray-100 to-gray-200
        border border-gray-200
        rounded-lg
        shadow-sm
        flex flex-col items-center justify-center
        p-4
        transition-transform transition-shadow duration-200
        hover:shadow-lg hover:scale-105
        cursor-pointer
        w-100
      '>
      <h5 className='text-lg font-semibold text-gray-800'>{name}</h5>
    </div>
  );
};

export default CategoryCard;
