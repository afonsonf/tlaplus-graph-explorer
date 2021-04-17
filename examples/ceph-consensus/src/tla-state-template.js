document.write(`
  <template id="mainTemplate">
    <div class="state-mainContent">
      <div id="monitorsDiv" class="state-monitorsDiv"></div>
      <div id="infoDiv" class="state-infoDiv">
        <div id="messagesDiv" class="state-messagesDiv">
          <p style="font-size: 18px">Message Queue:</p>
        </div>
        <div id="infoDivRight" class="state-infoDivRight">
          <div id="stateInfoDiv" class="state-stateInfoDiv">
            <div style="font-size: 18px; margin-bottom: 5px;">State Info:</div>
            <div> Step: <p id="stateInfo-step"></p> </div>
            <div> Epoch: <p id="stateInfo-epoch"></p> </div>
          </div>
          <div id="valuesDiv" class="state-valuesDiv">
            <p style="font-size: 18px">Values:</p>
          </div>
        </div>
      </div>
      <div id="prettyPrint" class="state-prettyPrint"></div>
    </div>
  </template>

  <template id="monitorTemplate">
    <div id="monitor-div" class="state-monitor">
      <div style="display:flex;">
        <p id="monitor-name" style="font-size: 16px; font-weight: 700;"></p>
        <div id="monitor-value" style="font-size: 16px;" class="monitor-value"></div>
      </div>
      <div> Role: <p id="monitor-role"></p> </div>
      <div> State: <p id="monitor-state" style="font-size: 14px"></p> </div>
      <div> Pn: <p id="monitor-pn"></p> </div>
      <div> New value: <p id="monitor-new_value"></p> </div>
      <div> Pending pn: <p id="monitor-pending_pn"></p> </div>
      <div> Uncommitted: <br/>
          &nbsp;&nbsp; pn: <p id="monitor-uncommitted_pn"></p>
          &nbsp; version: <p id="monitor-uncommitted_v"></p>
          &nbsp; value: <p id="monitor-uncommitted_value"></p>
      </div>
    </div>
  </template>

  <template id="queueTemplate">
    <div class="queueDiv">
      <div id="queue-from" class="queue-from"></div>
      <div id="queue-list" class="queue-list"></div>
    </div>
  </template>

  <template id="singleQueueTemplate">
    <div class="singleQueueDiv">
      <div id="queue-dest" class="queue-dest"></div>
      <div id="queue-messages" class="queue-messages"></div>
    </div>
  </template>

  <template id="valueTemplate">
    <div class="valueDiv">
      <p id="value-monitor"></p>
      <div id="value-values" class="value-values">
        <p id="value-committed"></p>
        <p style="font-weight: 1000;"> | </p>
        <p id="value-uncommitted" style="color: gray"></p>
      </div>
    </div>
  </template>
`)
