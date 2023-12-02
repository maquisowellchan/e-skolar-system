import HeadSideBar from "../../Navbar/HeadSideBar/HeadSideBar"
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../OtherComponents/AuthProvider/AuthProvider';

export default function HeadEvaluation(){

    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/" />;
      }

    return(
        <>
        <HeadSideBar />

        <div className="p-4 sm:ml-64">
                <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
                
                
                
                
                
                </div>
            </div>
        </>
    )

}