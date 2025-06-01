import { useNavigate } from 'react-router-dom';
import { Category } from '../../types/Category';
import CategoryCard from '../CategoryCard/CategoryCard';

type CategoriesSectionProps = {
  categories: Category[] | undefined;
};

const CategoriesSection = ({ categories }: CategoriesSectionProps) => {
  const navigate = useNavigate();

  return categories && categories.length > 0 ? (
    <div
      className='
        overflow-x-scroll 
        md:grid
        md:grid-cols-2 lg:grid-cols-3 
        md:justify-center  
        flex
        md:gap-y-4
        md:gap-x-0
        lg:gap-4
        p-4
        gap-4
      '>
      {categories.map(cat => (
        <div
          key={cat.id}
          className=' sm:flex sm:justify-center gap-'>
          <CategoryCard
            name={cat.name}
            onClick={() => navigate(`/category/${cat.id}`)}
          />
        </div>
      ))}
    </div>
  ) : (
    <p className='text-gray-500'>No categories found.</p>
  );
};

export default CategoriesSection;
