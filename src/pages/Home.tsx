import React, {useEffect, useState} from 'react';
import {get, getMany, keys} from 'idb-keyval';
import { Link } from 'react-router-dom';
import {v4 as uuid} from 'uuid';

type Project = {
    id: number;
    name: string;
    notes: string;
    stitches: {
        row: number,
        stitch: number
    }[];
};

const Home = () => {
    const [projects, setProjects] = useState<Project[] | null>(null);
    useEffect(()=>{
        const getProjects = async () => {
            const ks = (await keys()).filter(k=>k.toString().startsWith('stitcher-'));
            const projects = await getMany<Project>(ks);
            setProjects(projects);
        };
        getProjects();
    }, []);
    return projects === null
    ? (<div>Loading...</div>)
    : (
        <>
            <h1 className='text-center text-lg'>
                Projects
            </h1>
            <div className="grid divide-blue-800 divide-y gap-1">
                <Link to={`/${uuid()}`}>New Project</Link>
                {projects.map(p=>(
                    <Link key={p.id} to={`/${p.id}`}>{p.name}</Link>
                ))}
            </div>
        </>
    );
}

export default Home;