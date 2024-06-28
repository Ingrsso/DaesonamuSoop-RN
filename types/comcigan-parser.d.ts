declare module "comcigan-parser" {
    type searchData = {
        _: number,
        region: string,
        name: string,
        code: number,
    }
    type timetableData = {
        [key: number]: {
            [key: number]: Array<Array<{
                grade: number,
                class: number,
                weekday: number,
                weekdayString: string,
                classTime: number,
                teacher: string,
                subject: string
            }>>
        }
    }
    export default class Timetable {
        public init(option:object):Promise<void>
        public search(keyword:string):Promise<searchData[]>
        public setSchool(keyword:number):void
        public getTimetable():Promise<timetableData>
        public getClassTime():string[]
    }
}
declare module "ssl-root-cas" {
    function create(): any
}