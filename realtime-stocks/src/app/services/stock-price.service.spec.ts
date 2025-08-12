import { io } from 'socket.io-client';

// Create a manual mock socket object
class MockSocket {
  events: { [key: string]: Function[] } = {};

  on(event: string, callback: Function) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  emit(event: string, data?: any) {
    if (this.events[event]) {
      this.events[event].forEach((cb) => cb(data));
    }
  }

  disconnect() {
    this.events = {};
  }
}

describe('Socket Service', () => {
  let service: any;
  let mockSocket: MockSocket;

  beforeEach(() => {
    mockSocket = new MockSocket();
    // Spy on io() to return our mock socket
    spyOn<any>(require('socket.io-client'), 'io').and.returnValue(mockSocket);
    // Create service instance
    const SocketService = require('./socket.service').SocketService;
    service = new SocketService();
  });

  it('should connect and listen to an event', () => {
    const callback = jasmine.createSpy('callback');
    service.listen('test-event').subscribe(callback);
    mockSocket.emit('test-event', { msg: 'Hello' });
    expect(callback).toHaveBeenCalledWith({ msg: 'Hello' });
  });

  it('should emit an event', () => {
    spyOn(mockSocket, 'emit').and.callThrough();
    service.emit('send-event', { data: 123 });
    expect(mockSocket.emit).toHaveBeenCalledWith('send-event', { data: 123 });
  });
});
