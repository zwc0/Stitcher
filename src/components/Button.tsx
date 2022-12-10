import React, {useState} from 'react';

type TListItem = {
    done: boolean;
    title: string;
    children: TListItem[];
};

const ListItem: React.FunctionComponent<TListItem & {
        onClickTitle: any;
        onChangeDone: any;
        removeItem: any;
        editTitle: any;
    }> =
({done, title, children, onClickTitle, onChangeDone, removeItem, editTitle}) => {
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [newTitle, setNewTitle] = useState<string>(title);
    const saveNewTitle = () => {
        editTitle(title, newTitle);
        setIsEdit(false);
    }
    return (
        <div className='flex'>
            <div>
                <input type="checkbox" checked={done} onChange={({target})=>onChangeDone({title, done: target.checked})} />
            </div>
            {isEdit
                ? <input value={newTitle} onChange={({target})=>setNewTitle(target.value)} />
                : <div className={`grow ${done && 'line-through'}`} onClick={()=>onClickTitle({title})}>
                    {title}
                </div>
            }
            <div>
                {isEdit
                ? <button type="button" onClick={saveNewTitle}>Save</button>
                : <button type="button" onClick={()=>setIsEdit(true)}>Edit</button>
                }
                <button type="button" onClick={()=>{removeItem({title})}}>Delete</button>
            </div>
        </div>
    )
}

const tryParseJson: <T>(json) => T | null = (json) => {
    try {
        if (typeof json !== 'string')
            return null;
        return JSON.parse(json);
    }catch(e){
        return null;
    }
}

const initList = () => tryParseJson<TListItem[]>(localStorage.getItem('shoppingList')) || [];

const getCurrList = (indexArr: string[], list: TListItem[]) => {
    return !indexArr.length ? list : indexArr.reduce((p,c) => {
        return p.find(l=>l.title === c)?.children ?? [];
    }, list)
}

const clone: <T>(json: T) => T = (json) => JSON.parse(JSON.stringify(json));

const Home = () => {
    const [list, setList] = useState<TListItem[]>(initList());
    const [newTitle, setNewTitle] = useState<string>('');
    const [indexArr, setIndexArr] = useState<string[]>([]);
    const currList = getCurrList(indexArr, list);
    const addItem = () => {
        if (!newTitle)
            return;
        const newList = clone(list);
        const newCurrList = getCurrList(indexArr, newList);
        if (newCurrList.some(l=>l.title === newTitle))
            return;
        newCurrList.push({done: false, title: newTitle, children: []});
        setList(newList);
        setNewTitle('');
    }
    const removeItem = ({title}) => {
        const newList = clone(list);
        const newCurrList = getCurrList(indexArr, newList);
        const index = newCurrList.findIndex(x=>x.title === title);
        newCurrList.splice(index, 1);
        setList(newList);
    }
    const editTitle = (title: string, newTitle: string) => {
        const newList = clone(list);
        const newCurrList = getCurrList(indexArr, newList);
        const item = newCurrList.find(l=>l.title === title);
        if (!item || newCurrList.some(l=>l.title === newTitle))
            return;
        item.title = newTitle;
        setList(newList);
    }
    const onChangeDone = ({title, done}) =>{
        const newList = clone(list);
        const newCurrList = getCurrList(indexArr, newList);
        const item = newCurrList.find(l=>l.title === title);
        if (!item)
            return newCurrList;
        item.done = done;
        setList(newList);
    }
    const onClickTitle = ({title}) => {
        setIndexArr(p => {
            const newArr = clone(p);
            newArr.push(title);
            return newArr;
        });
    }
    const back = () => {
        const newArr = clone(indexArr);
        newArr.pop();
        setIndexArr(newArr);
    }

    localStorage.setItem('shoppingList', JSON.stringify(list));

    return (
        <>
            <div>
                {indexArr.length > 0 && <button type="button" className='bg-blue-800 rounded-md p-1 px-2 mr-4 text-white' onClick={back}>Back</button>}
                {indexArr.join(' - ')}
            </div>
            {currList.map(li=>(
                <ListItem key={li.title} done={li.done} title={li.title} children={li.children}
                    onClickTitle={onClickTitle} onChangeDone={onChangeDone}
                    removeItem={removeItem} editTitle={editTitle} />
            ))}
            <div>
                <input value={newTitle} onChange={({target})=>{setNewTitle(target.value)}} />
                <button type="button" onClick={addItem}>Add Item</button>
            </div>
        </>
    );
}

export default Home;