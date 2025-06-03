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
        bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600
        rounded-lg
        shadow-sm
        flex flex-col items-center justify-center
        p-4
        transition-transform transition-shadow duration-200
        hover:shadow-lg hover:scale-105
        cursor-pointer
        w-100
      '>
      <p
        className=' text-3xl font-semibold text-white
      '>
        {name}
      </p>
    </div>
  );
};

export default CategoryCard;
