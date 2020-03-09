export default function ClickHandler(eventBus) {
    var priority = 10000;
    eventBus.on('element.dblclick', priority, function(event) {
        return false;
      });
  }
  ClickHandler.$inject = ['eventBus']