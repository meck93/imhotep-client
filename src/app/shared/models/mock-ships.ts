import {Ship} from './ship';
import {Stone} from './stone';

export const MOCKSHIPS: Ship[] = [
    {
        id: 1,
        gameId: 1,
        hasSailed: false,
        targetSite: '',
        MIN_STONES: 3,
        MAX_STONES: 4,
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
        gameId: 1,
        hasSailed: false,
        targetSite: '',
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
        gameId: 1,
        hasSailed: false,
        targetSite: '',
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
        gameId: 1,
        hasSailed: false,
        targetSite: '',
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