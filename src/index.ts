export { Components } from './components';

export class App{
    value: Date = new Date('2019-05-28');
    
    componentDidLoad(){
        console.log(this.value)
    }
}