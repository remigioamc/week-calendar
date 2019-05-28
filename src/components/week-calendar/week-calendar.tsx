import { Component, Prop, State, Watch,EventEmitter, Event, h } from "@stencil/core";

@Component({
  tag: "week-calendar",
  styleUrl: "week-calendar.css",
  shadow: true
})

export class WeekCalendar{
  @Prop() startDay: number = 1;
  @Prop() startDate: any = new Date();
  @Prop() blockBefore: boolean = true;
  @Prop({ mutable: true }) selectedDay: any = new Date();
  @Prop() locale: string = 'en-US';
  @Prop() disableWeekends: boolean = false;
  @Prop() disableDates: string;
  @Prop() enableDates: string;

  today: Date = new Date();
  weekOffset: number = 0

  @State() weekList: Array<object> = [];
  @State() disableInnerDates: Array<Date>;
  @State() enableInnerDates: Array<Date>;

  @Event() valueUpdated: EventEmitter;

  @Watch('startDate')
  validateDate(newValue: any){
    this.startDate = this.toDate(newValue);
  }
  
  @Watch('selectedDay')
  validateValue(newValue: any){
    if (newValue){
      this.selectedDay = this.toDate(newValue);
      this.setValue(this.selectedDay);
    }
  }

  @Watch('disableDates')
  validateDisableDates(newValue: any){
    if (newValue) this.disableInnerDates = JSON.parse(newValue).map(date => this.toDate(date));
  }

  @Watch('enableDates')
  validateEnableDates(newValue: any){
    if (newValue) this.enableInnerDates = JSON.parse(newValue).map(date => this.toDate(date));
  }

  dates(current: Date) {
    var week = new Array(); 
    current.setDate(current.getDate() - current.getDay() + this.startDay);
    for (var i = 0; i < 7; i++) {
        week.push(
            new Date(current)
        ); 
        current.setDate(current.getDate() +1);
    }
    return week; 
  }

  componentWillLoad() {
    console.log(this.selectedDay);
    this.validateValue(this.selectedDay);
    console.log(this.selectedDay);
    this.validateDate(this.startDate);
    this.validateDisableDates(this.disableDates);
    this.validateEnableDates(this.enableDates);
    this.createWeek();
  }

  toDate(d: any){
    return(
      d.constructor === Date ? d :
      d.constructor === Array ? new Date(d[0],d[1],d[2]) :
      d.constructor === Number ? new Date(d) :
      d.constructor === String && d.length <= 10 ? new Date(d + 'T00:00:00') :
      d.constructor === String ? new Date(d) :
      typeof d === "object" ? new Date(d.year,d.month,d.date) :
      NaN
    )
  }

  compareDates(date_a: any, date_b: any){
    var a = new Date(new Date(date_a).setHours(0,0,0,0));
    var b = new Date(new Date(date_b).setHours(0,0,0,0));
    return (this.booleanToNumber(a>b) - this.booleanToNumber(a<b))
  }

  booleanToNumber(bool: boolean){
    return bool ? 1 : 0;
  }

  moveWeek(date: Date, n: number): Date{
    let d = new Date(date);
    return new Date(d.setDate(d.getDate() + (7 * n)));
  }

  setValue(selectedDay?) {
    this.selectedDay = selectedDay || this.selectedDay;
    this.valueUpdated.emit({ selectedDay: this.selectedDay });
    this.createWeek();
  }

  moveForward(){
    this.weekOffset += 1;
    this.createWeek();
  }
  moveBackwards(){
    this.weekOffset -= 1;
    this.createWeek();
  }

  isDisable(day){
    return (this.blockBefore && this.compareDates(day, this.today) == -1) ||
      (this.disableWeekends && (day.getDay() == 0 || day.getDay() == 6)) ||
      (this.disableInnerDates && !!this.disableInnerDates.find(date => this.compareDates(date, day) == 0)) ||
      (this.enableInnerDates && !this.enableInnerDates.find(date => this.compareDates(date, day) == 0))
  }

  action(day){
    if(this.isDisable(day)){return}
    return this.setValue(day)
  }

  createWeek(){
    var date = this.moveWeek(this.startDate, this.weekOffset)
    var week = this.dates(date)
    var weekList = [];
    for(var i = 0; i < 7; i++){
      let day = week[i];
      weekList.push(<day-card key={day} day={day} disable={this.isDisable(day)}
                     selected={!!this.selectedDay && this.compareDates(day, this.selectedDay) == 0} onClick={ () => this.action(day)} locale={this.locale}></day-card>)
    }
    this.weekList = weekList;
  }

  render(){
    return (
      <div class="calendar">
        <div onClick={() => this.moveBackwards()} class="arrow-container">
          <div class="arrow arrow-left"></div>
        </div>
        <div class="container">
          {this.weekList}
        </div>
        <div onClick={() => this.moveForward()} class="arrow-container">
          <div class="arrow arrow-right"></div>
        </div>
      </div>
    );
  }
}