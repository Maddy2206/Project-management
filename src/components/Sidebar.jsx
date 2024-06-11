import React, { useContext, useState } from 'react';
import { ChevronRight, ChevronLeft, Plus, X, Trash } from 'react-feather';
import { Popover } from 'react-tiny-popover';
import { BoardContext } from '../context/BoardContext';
import * as AlertDialog from '@radix-ui/react-alert-dialog';

const Sidebar = () => {

    const blankBoard = {
        name: '',
        bgcolor: '#f60000',
        list: []
    };

    const [boardData, setBoarddata] = useState(blankBoard);
    const [collapsed, setCollapsed] = useState(false);
    const [showpop, setShowpop] = useState(false);
    const [deleteBoardIndex, setDeleteBoardIndex] = useState(null);
    const { allboard, setAllBoard } = useContext(BoardContext);

    const setActiveboard = (i) => {
        let newBoard = { ...allboard }
        newBoard.active = i;
        setAllBoard(newBoard);
    }

    const addBoard = () => {
        let newB = { ...allboard };
        newB.boards.push(boardData);
        setAllBoard(newB);
        setBoarddata(blankBoard);
        setShowpop(!showpop);
    }

    const confirmDeleteBoard = () => {
        deleteBoard(deleteBoardIndex);
        setDeleteBoardIndex(null);
    }

    const deleteBoard = (index) => {
        let newB = { ...allboard };
        newB.boards.splice(index, 1);

        if (newB.boards.length === 0) {
            newB.active = null;
        } else {
            if (newB.active === index) {
                newB.active = 0;
            } else if (newB.active > index) {
                newB.active -= 1;
            }
        }

        setAllBoard(newB);
    }

    return (
        <div className={`bg-[#121417] h-[calc(100vh-3rem)] border-r border-r-[#9fadbc29] transition-all linear duration-500 flex-shrink-0 ${collapsed ? 'w-[42px]' : 'w-[280px]'}`} >
            {collapsed && <div className='p-2'>
                <button onClick={() => setCollapsed(!collapsed)} className='bg-white hover:bg-blue-500 rounded-sm'>
                    <ChevronRight size={18}></ChevronRight>
                </button>
            </div>}
            {!collapsed && <div>
                <div className="workspace p-3 flex justify-between border-b border-b-[#9fadbc29]">
                    <h4 className='text-white'>MY WORKSPACE</h4>
                    <button onClick={() => setCollapsed(!collapsed)} className='bg-white hover:bg-blue-500 rounded-sm p-1'>
                        <ChevronLeft size={18}></ChevronLeft>
                    </button>
                </div>
                <div className="boardlist">
                    <div className='flex justify-between px-3 py-2'>
                        <h6 className='text-white'>MY BOARDS</h6>

                        <Popover
                            isOpen={showpop}
                            align='start'
                            positions={['right', 'top', 'bottom', 'left']}
                            content={
                                <div className='ml-2 p-2 w-60 flex flex-col justify-center items-center bg-slate-600 text-white rounded'>
                                    <button onClick={() => setShowpop(!showpop)} className='bg-red-500 absolute right-2 top-2 p-1 rounded'><X size={16}></X></button>
                                    <h4 className='py-3'>Create Board</h4>
                                    <img src="https://placehold.co/200x120/png" alt="" />
                                    <div className="mt-3 flex flex-col items-start w-full">
                                        <label htmlFor="title">Board Title <span>*</span></label>
                                        <input value={boardData.name} onChange={(e) => setBoarddata({ ...boardData, name: e.target.value })} type="text" className='mb-2 h-8 px-2 w-full bg-gray-700' />
                                        <label htmlFor="Color">Board Color</label>
                                        <input value={boardData.bgcolor} onChange={(e) => setBoarddata({ ...boardData, bgcolor: e.target.value })} type="color" className='mb-2 h-8 px-2 w-full bg-gray-700' />
                                        <button onClick={() => addBoard()} className='w-full rounded h-8 bg-slate-700 mt-2 hover:bg-gray-500'>Create</button>
                                    </div>
                                </div>
                            }
                        >
                            <button onClick={() => setShowpop(!showpop)} className='hover:bg-blue-400 bg-white p-1 rounded-sm'>
                                <Plus size={16}></Plus>
                            </button>
                        </Popover>

                    </div>
                </div>
                <ul>
                    {allboard.boards && allboard.boards.map((x, i) => {
                        return (
                            <li key={i} className="flex items-center justify-between px-3 py-2 w-full text-sm text-white hover:bg-gray-500">
                                <button onClick={() => setActiveboard(i)} className='flex items-center w-full'>
                                    <span className='w-6 h-6 rounded-sm mr-2' style={{ backgroundColor: `${x.bgcolor}` }}>&nbsp;</span>
                                    <span>{x.name}</span>
                                </button>
                                {i !== 0 && (
                                    <AlertDialog.Root>
                                        <AlertDialog.Trigger asChild>
                                            <button onClick={() => setDeleteBoardIndex(i)} className='hover:bg-red-600 rounded-sm p-1'>
                                                <Trash size={16} />
                                            </button>
                                        </AlertDialog.Trigger>
                                        <AlertDialog.Portal>
                                            <AlertDialog.Overlay className="bg-black/30 fixed inset-0" />
                                            <AlertDialog.Content className="fixed bg-white p-6 rounded-lg shadow-md top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-md">
                                                <AlertDialog.Title className="text-lg font-bold">Confirm Delete</AlertDialog.Title>
                                                <AlertDialog.Description className="mt-2">
                                                    Are you sure you want to delete this board? This action cannot be undone.
                                                </AlertDialog.Description>
                                                <div className="mt-4 flex justify-end gap-2">
                                                    <AlertDialog.Cancel asChild>
                                                        <button className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded">Cancel</button>
                                                    </AlertDialog.Cancel>
                                                    <AlertDialog.Action asChild>
                                                        <button onClick={confirmDeleteBoard} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">Delete</button>
                                                    </AlertDialog.Action>
                                                </div>
                                            </AlertDialog.Content>
                                        </AlertDialog.Portal>
                                    </AlertDialog.Root>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </div>}
        </div>
    );
}

export default Sidebar;
