import {Ship} from './ship';
import {Stone} from './stone';

export const MOCKSHIPS: Ship[] = [
    {
        id: 1,
        minStone: 3,
        maxStone: 5,
        stones:Stone[5] = [
            {
                id: 1,
                color:'BLACK'
            },
            {
                id: 2,
                color:'WHITE'
            },
            {
                id: 3,
                color:''
            },
            {
                id: 4,
                color:'BLACK'
            },
            {
                id: 5,
                color:''
            },
        ]
    },
    {
        id: 2,
        minStone: 2,
        maxStone: 4,
        stones:Stone[5] = [
            {
                id: 1,
                color:''
            },
            {
                id: 2,
                color:''
            },
            {
                id: 3,
                color:''
            },
            {
                id: 4,
                color:'BROWN'
            },
        ]
    },
    {
        id: 3,
        minStone: 1,
        maxStone: 3,
        stones:Stone[5] = [
            {
                id: 1,
                color:'BROWN'
            },
            {
                id: 2,
                color:'GRAY'
            },
            {
                id: 3,
                color:''
            },
        ]
    },
    {
        id: 4,
        minStone: 1,
        maxStone: 1,
        stones:Stone[5] = [
            {
                id: 1,
                color:''
            }
        ]
    },
];