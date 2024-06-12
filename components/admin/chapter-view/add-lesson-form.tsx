'use client';

import showClicked from "@/app/utils/clicked";
import RollerAnimation from "@/components/multipurpose/roller-white";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useRef, useState } from "react";

interface AddLessonProps {
    courseId: number;
    chapterId: number;
    show: React.Dispatch<React.SetStateAction<boolean>>;
};

const AddLesson: React.FC<AddLessonProps> = ({ courseId, chapterId, show }) => {
    const [isSUbmitting, setIsSubmitting] = useState<boolean>(false);
    const [openingNote, setOpeningNote] = useState<string>('');
    const [closingNote, setClosingNote] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [lecture, setLecture] = useState<File | null>(null);
    const [lectureUrl, setLectureUrl] = useState<string>('');
    const [success, setSuccess] = useState<boolean>(false);
    let apiHost = process.env.NEXT_PUBLIC_API_HOST;
    const url = `${apiHost}/admin/create-lecture/${courseId}/${chapterId}`;
    const cancleBtRef = useRef<HTMLButtonElement | null>(null);

    const inputChange = (name: string, data: string) => {
        switch (name) {
            case 'openingNote':
                setOpeningNote(data);
                break;
            case 'closingNote':
                setClosingNote(data);
        };
    };

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) return setError('select a lecture');

        const url = URL.createObjectURL(file);
        setLectureUrl(url);
        setLecture(file);
    };

    const cancle = () => {
        if (cancleBtRef.current) showClicked(cancleBtRef.current);
        setTimeout(() => show(false), 250);
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!lecture) return setError('please select a lecture');
        if (!openingNote || !closingNote) return setError('please enter all fields');

        const formData = new FormData();

        formData.append('openingNote', openingNote);
        formData.append('closingNote', closingNote);
        formData.append('lecture', lecture);

        setIsSubmitting(true);
        setError('');

        try {
            const response = await fetch(url, {
                method: 'Post',
                credentials: 'include',
                headers: {
                },
                body: formData
            });

            if (response.status !== 200) throw 'soemthing went wrong';

            setSuccess(true);
            setTimeout(() => window.location.reload, 250);
        } catch (err) {
            setError('Something went wrong. Try again.')
        } finally {
            setIsSubmitting(false)
        };
    };

    return (
        <div className="fixed top-0 right-0 w-full h-full flex items-center justify-center px-4 py-6 bg-blue-600 bg-opacity-85 overflow-auto z-50">
            <div className="p-5 w-full relative bg-white rounded-xl overflow-auto pt-4">
                <button
                    ref={cancleBtRef}
                    onClick={cancle}
                    className="hideBt absolute top-3 right-3 w-7 h-7 bg-red-100 rounded-full"
                >
                    <FontAwesomeIcon icon={faX} className="text-red-500" />
                </button>

                <h2 className="text-lg font-medium mb-5">Create lesson</h2>
                <form onSubmit={handleSubmit} >
                    <label htmlFor="open-note font-medium">Opening note</label>
                    <textarea name="open-note"
                        value={openingNote}
                        onChange={(e) => inputChange('openingNote', e.target.value)}
                        className="border-[1px] border-gray-200 rounded-lg p-2 w-full h-12 block mb-3"
                    ></textarea>

                    <label htmlFor="open-note font-medium">Closing note</label>
                    <textarea name="open-note"
                        value={closingNote}
                        onChange={(e) => inputChange('closingNote', e.target.value)}
                        className="border-[1px] border-gray-200 rounded-lg p-2 w-full h-12 block mb-3"
                    ></textarea>

                    <label htmlFor="lecture font-medium">Lecture</label>
                    <input name="lecture" type="file" accept="audio/*" className="block mb-6" onChange={onFileChange} />

                    {lectureUrl && (
                        <div className="mb-6">
                            <audio src={lectureUrl} controls></audio>
                        </div>
                    )}

                    {error && <p className="text-sm text-center text-red-500 mb-4">{error}</p>}
                    {success && (
                        <p className="text-sm text-center text-green-600 mb-4">
                            lesson created successfully
                        </p>)
                    }

                    <div
                        className="text-right">
                        <button className="bg-blue-500 rounded-full py-2 px-4 text-white">
                            {isSUbmitting ? (
                                <RollerAnimation h='h-[1.5rem]' />
                            ) : (
                                'Create'
                            )}
                        </button>
                    </div>
                </form>
            </div>

        </div>
    )
};

export default AddLesson;