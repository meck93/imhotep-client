import {BasicShip} from './basicShip';
import {Stone} from './stone';

export const MOCKSHIPS: BasicShip[] = [
    {
        id: 1,
        MIN_STONES: 3,
        MAX_STONES: 5,
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
        MIN_STONES: 2,
        MAX_STONES: 4,
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
        MIN_STONES: 1,
        MAX_STONES: 3,
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
        MIN_STONES: 1,
        MAX_STONES: 1,
        stones:Stone[5] = [
            {
                id: 1,
                color:''
            }
        ]
    },
];