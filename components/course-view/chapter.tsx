'use client';

import React, { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp, faArrowDown, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import showClicked from '@/app/utils/clicked';


interface ChapterProps {
    chapter: chapterType;
}

interface chapterType {
    num: number;
    name: string;
    completed: 'finished' | 'ongoing' | 'pending';
    lessons: Lesson[];
}

interface Lesson {
    title: string;
    completed: 'finished' | 'ongoing' | 'pending';
}


const Chapter: React.FC<ChapterProps> = ({ chapter }) => {
    const router = useRouter();
    const [showLessons, setShowLessons] = useState(false);

    const toggleLesson = () => {
        setShowLessons(!showLessons);
    };

    return (
        <div className="relative bg-white rounded-lg p-4 mb-5 shadow-md mx-4">
            {/* Completed badge */}
            {chapter.completed === 'finished' ? (
                <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="absolute top-2 right-2 text-green-500"
                />
            ) : (
                chapter.completed === 'ongoing' ? (
                    <div className="w-2 h-2 rounded-full bg-green-500 absolute top-3 right-3"></div>
                ) : (
                    ''
                )
            )}

            {/* Chapter title */}
            <h3 className="text-lgF font-medium text-gray-800 mb-2">{chapter.num}. {chapter.name}</h3>

            {/* Lesson count and toggle */}
            <div
                onClick={toggleLesson}
                className="flex justify-between items-center cursor-pointer"
            >
                <span className="text-gray-700">{chapter.lessons.length} Lessons</span>
                <FontAwesomeIcon
                    icon={showLessons ? faArrowUp : faArrowDown}
                    className="text-blue-500"
                />
            </div>

            {/* Lessons list */}
            {showLessons && (
                <ul className="mt-4 list-none pl-4">
                    {chapter.lessons.map((lesson, index) => (
                        <Lesson key={index} lesson={lesson} router={router} />
                    ))}
                </ul>
            )}
        </div>
    );
};

const Lesson: React.FC<{ lesson: Lesson; router: AppRouterInstance }> = ({ lesson, router }) => {
    const optionRef = useRef<HTMLLIElement | null>(null);

    const toLecture = () => {
        if (lesson.completed === 'pending') return console.log('lessson not completed.........');
        showClicked(optionRef);
        setTimeout(() => router.push('/lecture'), 250);
    };

    return (
        <li
            ref={optionRef}
            onClick={toLecture}
            className="flex items-center gap-3 py-2 border-b border-gray-200">
            <div
                className={`w-3 h-3 rounded-full mr-2 ${lesson.completed === 'finished' && "bg-blue-500"}  ${lesson.completed === 'pending' && "bg-gray-500"}
                ${lesson.completed === 'ongoing' && "bg-green-500"} }`}
            ></div>
            <div className={`${lesson.completed === 'finished' && 'text-blue-400'} ${lesson.completed === 'pending' && 'text-gray-600'} ${lesson.completed === 'ongoing' && 'text-green-600'}
            `}>{lesson.title}</div>
        </li>
    );
};

export default Chapter;

export type { chapterType }