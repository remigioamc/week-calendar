import { Component, Prop, h } from "@stencil/core";

@Component({
  tag: "day-card",
  styleUrl: "day-card.css",
  shadow: true
})

export class DayCard{
	@Prop() day: Date;
	@Prop() disable: boolean = false;
	@Prop() selected: boolean = false;
	@Prop() locale: string;
	options = {weekday: 'short', month: "short", year: "numeric" }


	
	render(){
    return (
      <div class={'container' + (this.disable ? ' disable' : '')}>
        <div class="title"><b>{this.day.toLocaleDateString(this.locale, { weekday: 'short'}).replace(".", "")}</b></div>
				<div class={'date' + (this.selected ? ' selected' : '')} >
					<span class="month">{this.day.toLocaleDateString(this.locale, { month: 'short'}).replace(".", "")}</span>
					<span class="number">{this.day.getDate()}</span>
				</div>
      </div>
    );
  }
}