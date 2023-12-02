import DirectorSideBar from "../../Navbar/DirectorSideBar/DirectorSideBar"
import { useAuth } from '../../OtherComponents/AuthProvider/AuthProvider';
import { Navigate } from 'react-router-dom';

export default function DirectorReports(){

    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/" />;
      }

    return(
        <>
        <DirectorSideBar />

        <div className="p-4 sm:ml-64">
                <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
                
                
                
                
                
                </div>
            </div>
        </>
    )
}