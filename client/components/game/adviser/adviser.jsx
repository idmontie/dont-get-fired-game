import React from 'react';

export default React.createClass({
  render() {
    return (
        <div>
          <span className="adviser">
            {this.props.main.text}
          </span>
        </div>
    );
  }
});
