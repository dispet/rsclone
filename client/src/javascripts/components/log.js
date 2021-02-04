const [second, minute, hour, day ] = [1000, 60000, 60000 * 60, 60000 * 60 * 24];

export class Log {
    constructor(action, name, subject, createdAt, currentTime, toColumn='', fromColumn=''){
        this.action = action;
        this.name = name;
        this.subject = subject;
        this.createdAt = createdAt;
        this.currentTime = currentTime;
        this.from_column = fromColumn;
        this.to_column = toColumn;
    }

    render() {
        return `<div class="log no-select list-group-item list-group-item-info"><span class="icon"><i class="fas fa-user-clock"></i></span>
                    <div class="logcontent"><span class="blueword">@${this.name} </span><span class="act">${this.action} </span><span class="blueword">${this.subject} </span><span>${this.toFrom}</span>
                        <div class="logtime">${this.logtime}</div>
                    </div>
                </div>`
    }

    get logtime() {
        const curr = this.currentTime.getTime();
        const createTime = new Date(this.createdAt).getTime();
        const elapsedTime = curr - createTime;
        if (elapsedTime < minute)
            return (elapsedTime < 0) ? `${0} seconds ago`: `${Math.floor(elapsedTime/ second)} seconds ago`;
        if (elapsedTime < hour)
            return `${Math.floor(elapsedTime / minute)} minutes ago`;
        if (elapsedTime < day)
            return `${Math.floor(elapsedTime / hour)} hours ago`;
        return `${Math.floor(elapsedTime / day)} days ago`;
    }

    get toFrom() {
        const from = this.from_column ? `from ${this.from_column} ` : '';
        const to = this.to_column ? `to ${this.to_column} ` : '';

        return from+to;
    }
}

