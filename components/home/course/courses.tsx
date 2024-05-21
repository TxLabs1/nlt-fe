import { useEffect, useState } from "react";
import CourseCard from "./unit-course";
import Loader from '@/components/multipurpose/loader';
import { tree } from "next/dist/build/templates/app-page";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";

interface courseType {
    courseId: number;
    courseName: string;
    courseTitle: string;
    courseDescription: string;
    createdAt: string;
    lessonNumber: number;
    chapterNumber: number;
    enrolledStudents: number;
    lastVisited: string;
    progress: number;
    imageUrl: string;
    isEnrolled: boolean;
};

const CoursesView: React.FC<{ enrolled: boolean }> = ({ enrolled }) => {
    const [courses, setCourses] = useState<courseType[]>([]);
    const [showLoader, setShowLoader] = useState<boolean>(true);
    const [showError, setShowError] = useState<boolean>(false);
    const [reload, setReload] = useState<boolean>(false);
    const apiHost = process.env.NEXT_PUBLIC_API_HOST;


    const fetchCourses = async () => {
        try {
            setShowLoader(true);
            setShowError(false);

            const response = await fetch(`${apiHost}/users/courses/0/5`, {
                method: 'GET',
                credentials: 'include'
            });

            if (response.status === 200) {
                const data = await response.json();
                setCourses([...data.data]);
                setShowLoader(false);
            }
        } catch (error) {
            setShowError(true)
        } finally {
            setShowLoader(false)
        }
    }

    useEffect(() => {
        fetchCourses();
    }, [reload]);

    return (
        <>
            {showLoader ? (
                <div className="mt-36">
                    <Loader h='h-[8em]' />
                </div>
            ) : (
                <div className="mt-10">
                    <h2 className="mb-4 ml-4 font-semibold">Courses</h2>

                    {showError ? (
                        <div className="error-container mx-4 bg-red-100 text-red-500 p-4 rounded-lg shadow-md mt-8">
                            <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
                            <span className="text-lg">Something went wrong</span>
                            <button onClick={() => setReload(!reload)} className="bg-white text-red-500 px-4 py-2 ml-4 rounded-md shadow-md">
                                Reload
                            </button>
                        </div>
                    ) : (
                        <div>
                            {courses.map((course, index) => {
                                return <CourseCard
                                    key={index}
                                    title={course.courseTitle}
                                    description={course.courseDescription}
                                    enrolledStudents={course.enrolledStudents}
                                    imageUrl={course.imageUrl}
                                    numChapters={course.chapterNumber}
                                    numLessons={course.lessonNumber}
                                    isEnrolled={course.isEnrolled}
                                    progress={course.progress}
                                    lastVisited={course.lastVisited}
                                />
                            })}
                        </div>
                    )}
                </div>
            )}
        </>

    )
};
const mockData: courseType[] = [
    {
        courseId: 123,
        courseName: 'Protocol oo1',
        courseTitle: 'Basics of networking',
        courseDescription: `"Welcome to Quantum Computing Fundamentals! This course offers an 
    introductory exploration into the fascinating world of quantum computing. Designed for 
    beginners, it provides a foundational understanding of the principles and concepts that 
    underpin quantum computation and quantum information theory.`,
        createdAt: '2020-05-13',
        lessonNumber: 40,
        chapterNumber: 4,
        enrolledStudents: 320,
        lastVisited: '2020-05-13',
        progress: 60,
        imageUrl: '/images/e-learning-1.jpg',
        isEnrolled: false,
    },
    {
        courseId: 123,
        courseName: 'Protocol oo1',
        courseTitle: 'Basics of networking',
        courseDescription: `"Welcome to Quantum Computing Fundamentals! This course offers an 
    introductory exploration into the fascinating world of quantum computing. Designed for 
    beginners, it provides a foundational understanding of the principles and concepts that 
    underpin quantum computation and quantum information theory.`,
        createdAt: '2020-05-13',
        lessonNumber: 40,
        chapterNumber: 4,
        enrolledStudents: 320,
        lastVisited: '2020-05-13',
        progress: 60,
        imageUrl: '/images/e-learning-1.jpg',
        isEnrolled: true,
    }
]
export default CoursesView;

export type { courseType }