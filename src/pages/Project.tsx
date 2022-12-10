import React, {useEffect, useState} from 'react';
import {get, getMany, set, keys} from 'idb-keyval';
import { clone } from '../helpers/helpers';
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

type TProject = {
    id: string;
    name: string;
    notes: string;
    stitches: number[];
};

const Project = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    if (!id) {
        navigate('/');
        return (<></>);
    } 
    const [isLoading, setIsLoading] = useState(true);
    const [name, setName] = useState('New Project');
    const [notes, setNotes] = useState('');
    const [stitches, setStitches] = useState<number[]>([1]);
    const [stitchIndex, setStitchIndex] = useState(0);
    useEffect(()=>{
        (async () => {
            const project = await get<TProject>(`stitcher-${id}`);
            if (!project) {
                setIsLoading(false);
                return;
            }
            setName(project.name);
            setNotes(project.notes);
            setStitches(project.stitches);
            setStitchIndex(project.stitches.length - 1);
            setIsLoading(false);
        })();
    }, []);
    const rename = () => {
        const newName = window.prompt('Rename project: ', name);
        if (newName)
            setName(newName);
    }
    const updateStitches = (newCount?: number, stitchIndexOverride?: number) => {
        setStitches(stitches => {
            const newStitches = clone(stitches);
            const count = newCount ?? newStitches[stitchIndex] + 1;
            newStitches[stitchIndexOverride ?? stitchIndex] = count < 1 ? 1 : count;
            return newStitches;
        });
    };
    const updateStitchIndex = (index: number) => {
        const newIndex = index < 0 ? 0 : index
        setStitchIndex(newIndex);
        if (!stitches[newIndex])
            updateStitches(0, newIndex);
    }
    const saveProject = async () => {
        const project: TProject = {
            id,
            name,
            notes,
            stitches
        };
        set(`stitcher-${id}`, project);
    }
    if (!isLoading && id)
        saveProject();

    return isLoading
    ? (<div>Loading...</div>)
    : (<>
        <div className='flex bg-blue-200'>
            <Link to="/" className='bg-blue-800 text-white p-2'>Home</Link>
            <h1 className='grow p-2' onClick={rename}>
                {name}
            </h1>
        </div>
        <div className='flex'>
            <textarea value={notes} className="w-full m-4 h-20 border border-black resize-none p-1"
                onChange={({target})=>setNotes(target.value)}></textarea>
        </div>
        <div className="">
            <div className='text-center pb-6'>
                <button type='button' onClick={()=>updateStitches()}
                    className="h-40 aspect-square rounded-full bg-red-500">
                    <span className='sr-only'>Add 1</span>
                </button>
            </div>
            <div className='flex justify-center gap-2'>
                <div>
                    <label>
                        Stitch:
                        <input type="number" value={stitchIndex + 1}
                            className="ml-2 w-12"
                            onChange={({target})=>updateStitchIndex((+target.value || 1) - 1)} />
                    </label>
                    <div className='flex gap-2 justify-center'>
                    <button className='bg-gray-200 px-4 font-bold'
                            onClick={()=>updateStitchIndex(stitchIndex - 1)}>
                            &#8249;
                            <span className='sr-only'>Stitch down</span>
                        </button>
                        <button className='bg-gray-200 px-4 font-bold'
                            onClick={()=>updateStitchIndex(stitchIndex + 1)}>
                            &#8250;
                            <span className='sr-only'>Stitch up</span>
                        </button>
                    </div>
                </div>
                <div>
                    <label>
                        Row:
                        <input type="number" value={stitches[stitchIndex]}
                            className="ml-2 w-12"
                            onChange={({target})=>updateStitches(+target.value || 1)} />
                    </label>
                    <div className='flex gap-2 justify-center'>
                    <button className='bg-gray-200 px-4 font-bold'
                            onClick={()=>updateStitches(stitches[stitchIndex] - 1)}>
                            &#8249;
                            <span className='sr-only'>Row down</span>
                        </button>
                        <button className='bg-gray-200 px-4 font-bold'
                            onClick={()=>updateStitches(stitches[stitchIndex] + 1)} >
                            &#8250;
                            <span className='sr-only'>Row up</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </>);
}

export default Project;